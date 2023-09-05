import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = <T>(...roles: T[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
