import { VerusdRpcInterface } from 'verusd-rpc-ts-client';

const verusd = VerusdRpcInterface("iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq", "https://api.verustest.net");

export const fetchCurrency = async (currency) => {
  try {
    const response = await verusd.getCurrency(currency);
    return response;
  } catch (error) {
    console.error("Error fetching currency:", error);
    throw error;
  }
};

export const fetchInfo = async () => {
  try {
    const response = await verusd.getInfo();
    return response;
  } catch (error) {
    console.error("Error fetching info:", error);
    throw error;
  }
};