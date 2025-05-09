import { Authenticator } from '@tapis/tapis-typescript';
import apiGenerator from './apiGenerator';
import errorDecoder from './errorDecoder';

// This helper takes the username and password and assembles an API call
const login = (
  username: string,
  password: string,
  basePath: string,
): Promise<Authenticator.RespCreateToken> => {
  const reqCreateToken: Authenticator.ReqCreateToken = {
    username,
    password,
    grant_type: 'password',
  };
  const request: Authenticator.CreateTokenRequest = {
    reqCreateToken,
  };

  const api: Authenticator.TokensApi = apiGenerator<Authenticator.TokensApi>(
    Authenticator,
    Authenticator.TokensApi,
    basePath,
    null,
  );

  return errorDecoder(() => api.createToken(request));
};

export default login;
