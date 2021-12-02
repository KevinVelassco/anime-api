import { nanoid } from 'nanoid';

export const generateUuid = (size?: number): string => nanoid(size);
