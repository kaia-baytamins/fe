import { API_CONFIG, getAuthHeaders, handleApiError } from './config';
import type { 
  GasDelegationRequest,
  GasDelegationResponse,
  GasEstimationResponse,
  EligibilityResponse,
  GasStats
} from './types';
import { ethers } from 'ethers';
import { TxType } from '@kaiachain/ethers-ext/v6';

interface TransactionForSigning {
  transaction: any;
  encodedTx: string;
  transactionHash: string;
}

interface SupportedTypesResponse {
  supportedTypes: string[];
  feePayer: string;
}

interface FeePayerResponse {
  feePayer: string;
}

class GasDelegationService {
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    await handleApiError(response);
    return response.json();
  }

  /**
   * Delegate gas fees for a transaction
   */
  async delegateGasFees(request: GasDelegationRequest): Promise<GasDelegationResponse> {
    return this.fetchApi<GasDelegationResponse>(API_CONFIG.ENDPOINTS.GAS_DELEGATE, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Estimate gas delegation cost
   */
  async estimateDelegationCost(request: Omit<GasDelegationRequest, 'userSignature'>): Promise<GasEstimationResponse> {
    return this.fetchApi<GasEstimationResponse>(API_CONFIG.ENDPOINTS.GAS_ESTIMATE, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Prepare transaction for user signing
   */
  async prepareTransactionForSigning(request: Omit<GasDelegationRequest, 'userSignature'>): Promise<TransactionForSigning> {
    return this.fetchApi<TransactionForSigning>(API_CONFIG.ENDPOINTS.GAS_PREPARE_SIGNING, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Check if address is eligible for gas delegation
   */
  async checkEligibility(address: string): Promise<EligibilityResponse> {
    return this.fetchApi<EligibilityResponse>(API_CONFIG.ENDPOINTS.GAS_CHECK_ELIGIBILITY, {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  /**
   * Get gas delegation statistics
   */
  async getStats(): Promise<GasStats> {
    return this.fetchApi<GasStats>(API_CONFIG.ENDPOINTS.GAS_STATS);
  }

  /**
   * Get supported transaction types
   */
  async getSupportedTypes(): Promise<SupportedTypesResponse> {
    return this.fetchApi<SupportedTypesResponse>(API_CONFIG.ENDPOINTS.GAS_SUPPORTED_TYPES);
  }

  /**
   * Get fee payer address
   */
  async getFeePayer(): Promise<FeePayerResponse> {
    return this.fetchApi<FeePayerResponse>(API_CONFIG.ENDPOINTS.GAS_FEE_PAYER);
  }

  /**
   * Helper: Delegate transaction with prepared data
   */
  async delegateTransactionWithData(
    transactionData: {
      from: string;
      to: string;
      data: string;
      gas: string;
      gasPrice?: string;
      value: string;
      type: string;
      signedMessage?: string;
    },
    userSignature: string
  ): Promise<GasDelegationResponse> {
    return this.delegateGasFees({
      from: transactionData.from,
      to: transactionData.to,
      data: transactionData.data,
      gas: transactionData.gas,
      gasPrice: transactionData.gasPrice,
      value: transactionData.value,
      type: transactionData.type as 'value_transfer' | 'value_transfer_memo' | 'contract_execution',
      userSignature,
      signedMessage: transactionData.signedMessage
    });
  }

  /**
   * Helper: Complete DeFi transaction flow
   */
  async completeDefiTransaction(
    transactionData: {
      from: string;
      to: string;
      data: string;
      gas: string;
      gasPrice?: string;
      value: string;
      type: 'value_transfer' | 'value_transfer_memo' | 'contract_execution';
    }
  ): Promise<{
    prepared: TransactionForSigning;
    estimate: GasEstimationResponse;
    eligible: EligibilityResponse;
  }> {
    const [prepared, estimate, eligible] = await Promise.all([
      this.prepareTransactionForSigning(transactionData),
      this.estimateDelegationCost(transactionData),
      this.checkEligibility(transactionData.from)
    ]);

    return { prepared, estimate, eligible };
  }

  /**
   * Helper: Validate transaction data before delegation
   */
  validateTransactionData(transactionData: Partial<GasDelegationRequest>): string[] {
    const errors: string[] = [];

    if (!transactionData.from) {
      errors.push('From address is required');
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(transactionData.from)) {
      errors.push('Invalid from address format');
    }

    if (transactionData.to && !/^0x[a-fA-F0-9]{40}$/.test(transactionData.to)) {
      errors.push('Invalid to address format');
    }

    if (!transactionData.gas) {
      errors.push('Gas limit is required');
    } else if (isNaN(Number(transactionData.gas))) {
      errors.push('Gas limit must be a valid number');
    }

    if (transactionData.value && isNaN(Number(transactionData.value))) {
      errors.push('Value must be a valid number');
    }

    return errors;
  }

  /**
   * Helper: Format transaction for display
   */
  formatTransactionForDisplay(transactionData: GasDelegationRequest): {
    from: string;
    to: string;
    value: string;
    gasLimit: string;
    gasPrice: string;
    type: string;
  } {
    return {
      from: transactionData.from,
      to: transactionData.to || 'Contract Call',
      value: `${transactionData.value || '0'} KAIA`,
      gasLimit: transactionData.gas,
      gasPrice: transactionData.gasPrice || 'Auto',
      type: transactionData.type || 'contract_execution'
    };
  }

  /**
   * Backend reference: Create senderTxHashRLP from user signature
   * This method shows how backend should reconstruct senderTxHashRLP
   * using @kaiachain/ethers-ext/v6 after receiving user signature from frontend
   */
  async createSenderTxHashRLP(
    transactionData: {
      type: number;
      from: string;
      to: string;
      value: string;
      data: string;
      gas: string;
      gasPrice: string;
      nonce: string;
      chainId: string;
    },
    userSignature: string
  ): Promise<string> {
    try {
      // This is for backend implementation reference
      // Frontend cannot do this directly due to security constraints
      
      // Example backend implementation:
      // 1. Recreate the transaction object
      const tx = {
        type: TxType.FeeDelegatedSmartContractExecution,
        from: transactionData.from,
        to: transactionData.to,
        value: transactionData.value,
        data: transactionData.data,
        gas: transactionData.gas,
        gasPrice: transactionData.gasPrice,
        nonce: transactionData.nonce,
        chainId: transactionData.chainId
      };

      // 2. Parse user signature (r, s, v format)
      const r = userSignature.slice(0, 66); // 0x + 64 chars
      const s = '0x' + userSignature.slice(66, 130); // 64 chars
      const v = '0x' + userSignature.slice(130, 132); // 2 chars
      
      const signature = { r, s, v };

      // 3. Create KlaytnTx and add sender signature
      // const { KlaytnTxFactory } = require('@kaiachain/js-ext-core');
      // const klaytnTx = KlaytnTxFactory.fromObject(tx);
      // klaytnTx.addSenderSig(signature);
      // const senderTxHashRLP = klaytnTx.senderTxHashRLP();

      // 4. Return senderTxHashRLP to be used by fee payer
      // return senderTxHashRLP;

      throw new Error('This method is for backend implementation reference only');
    } catch (error) {
      console.error('senderTxHashRLP creation failed:', error);
      throw new Error('Failed to create senderTxHashRLP');
    }
  }

  /**
   * Helper: Create contract function data
   */
  createContractFunctionData(
    contractABI: string[],
    functionName: string,
    parameters: any[]
  ): string {
    try {
      const contract = new ethers.utils.Interface(contractABI);
      return contract.encodeFunctionData(functionName, parameters);
    } catch (error) {
      console.error('Failed to encode function data:', error);
      throw new Error('Failed to create contract function data');
    }
  }
}

export const gasDelegationService = new GasDelegationService();
export default gasDelegationService;