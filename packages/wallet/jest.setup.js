// If you need to add more setup options before each test, it's common to add them here.
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });
