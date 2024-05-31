export interface apiResponseSuccessType {
    success: true;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

interface apiError {
    code: number;
    info: string;
}

export interface apiResponseErrorType {
    success: false;
    error: apiError;
}

export type apiResponseType = apiResponseSuccessType | apiResponseErrorType;