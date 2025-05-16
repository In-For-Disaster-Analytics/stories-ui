interface GenericResponse<T> {
  help: string;
  success: boolean;
  result?: T;
  error?: {
    __type: string;
    message: string;
  };
}

export default GenericResponse;
