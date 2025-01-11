export enum ToolType {
  'Base64Tool' = 'base64-tool',
  'QRCode' = 'qr-code',
  'RpgmvpToPng' = 'rpgmvp-to-png',
  'StopwatchTool' = 'stopwatch-tool',
  'AesTool' = 'aes-tool',
}

export interface ToolMetaData {
  title: string;
  description: string;
  pathName: string;
}

// 使用枚举成员作为键
export const ToolMetaDataMap: Record<ToolType, ToolMetaData> = {
  [ToolType.Base64Tool]: {
    title: 'Base64工具',
    description: 'Base64工具',
    pathName: 'Base64Tool',
  },
  [ToolType.QRCode]: {
    title: '二维码工具',
    description: '二维码工具',
    pathName: 'QRCode',
  },
  [ToolType.RpgmvpToPng]: {
    title: 'RPGMVP转PNG',
    description: 'RPGMVP转PNG',
    pathName: 'RpgmvpToPng',
  },
  [ToolType.StopwatchTool]: {
    title: '秒表工具',
    description: '秒表工具',
    pathName: 'StopwatchTool',
  },
  [ToolType.AesTool]: {
    title: 'AES工具',
    description: 'AES工具',
    pathName: 'AesTool',
  },
};
