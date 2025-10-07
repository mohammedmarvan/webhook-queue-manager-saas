import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found') {
    super(message, 404);
  }
}
