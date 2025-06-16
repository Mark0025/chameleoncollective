'use server';

// Authorize.net payment actions for products
import type { Product } from '@/app/lib/definitions';

export type PaymentDetails = {
  cardNumber: string;
  expirationDate: string; // MM-YYYY
  cardCode: string;
  amount: number;
  firstName: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
};

export type PaymentResult = {
  success: boolean;
  transactionId?: string;
  error?: string;
  rawResponse?: any;
};

export async function chargeProductWithAuthorizeNet(
  product: Product,
  payment: PaymentDetails
): Promise<PaymentResult> {
  const endpoint = process.env.AUTHORIZE_NET_API_URL || 'https://apitest.authorize.net/xml/v1/request.api';
  const apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID;
  const transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY;

  if (!apiLoginId || !transactionKey) {
    return { success: false, error: 'Missing Authorize.net credentials' };
  }

  const body = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: apiLoginId,
        transactionKey: transactionKey,
      },
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: payment.amount,
        payment: {
          creditCard: {
            cardNumber: payment.cardNumber,
            expirationDate: payment.expirationDate,
            cardCode: payment.cardCode,
          },
        },
        billTo: {
          firstName: payment.firstName,
          lastName: payment.lastName,
          address: payment.address || '',
          city: payment.city || '',
          state: payment.state || '',
          zip: payment.zip || '',
          country: payment.country || '',
          email: payment.email || '',
        },
        lineItems: {
          lineItem: [
            {
              itemId: product.id,
              name: product.name,
              description: product.description,
              quantity: 1,
              unitPrice: product.price,
            },
          ],
        },
      },
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (
      data?.transactionResponse?.responseCode === '1' &&
      data?.transactionResponse?.transId
    ) {
      return {
        success: true,
        transactionId: data.transactionResponse.transId,
        rawResponse: data,
      };
    } else {
      return {
        success: false,
        error: data?.transactionResponse?.errors?.[0]?.errorText || 'Payment failed',
        rawResponse: data,
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment error' };
  }
}
