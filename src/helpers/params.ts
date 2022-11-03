export const getNumber = (
  name: string,
  fallback: number | undefined,
  params: URLSearchParams
) => {
  const param = parseInt(params.get(name) || '', 10);
  return Number.isNaN(param) ? fallback : param;
};

export const getString = (
  name: string,
  fallback: string | undefined,
  params: URLSearchParams
) => {
  return params.get(name) || fallback;
};

export const getBool = (
  name: string,
  fallback: boolean | undefined,
  params: URLSearchParams
) => {
  const param = params.get(name);
  return param ? param === 'true' : fallback;
};
