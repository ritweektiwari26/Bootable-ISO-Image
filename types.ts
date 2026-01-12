
export enum OS {
  UBUNTU = 'Ubuntu',
  DEBIAN = 'Debian',
  ARCH = 'Arch Linux',
  FEDORA = 'Fedora',
  ALPINE = 'Alpine Linux'
}

export enum Arch {
  X86_64 = 'x86_64',
  ARM64 = 'aarch64'
}

export interface ISOConfig {
  os: OS;
  version: string;
  architecture: Arch;
  hostname: string;
  username: string;
  password?: string;
  packages: string[];
  customScripts: string;
  isCloudInitEnabled: boolean;
}

export interface GeneratedFile {
  name: string;
  content: string;
  language: string;
}

export interface BuildLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
