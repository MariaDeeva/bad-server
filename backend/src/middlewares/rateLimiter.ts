import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Лимит запросов привышен, повторите попытку позже',
    headers: true,
});



export const getValidPageNumber = (page: any) => {
    const parsedPage = Number(page);
    return parsedPage > 0 ? parsedPage : 1;
};

export const getValidLimit = (limit: any) => Math.min(10, Math.max(1, Number(limit) || 10));
