import { model } from 'mongoose';
import { IUserConfigurationDocument } from './user_configuration.types';
import { UserConfigurationSchema } from './user_configuration';

export const UserConfigurationModel = model<IUserConfigurationDocument>('user_configuration', UserConfigurationSchema);
