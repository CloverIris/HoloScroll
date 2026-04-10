import html2canvas from 'html2canvas';
import { Achievement } from '../stores/database';

// 生成成就分享文本
export function generateAchievementText(achievement: Achievement): string {
  const rarityMap = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  
  return `🏆 我在 HoloScroll 获得了【${rarityMap[achievement.rarity]}】成就「${achievement.title}」！

${achievement.description}

进度: ${achievement.progress}/${achievement.maxProgress}
${achievement.unlockedAt ? `解锁时间: ${achievement.unlockedAt}` : ''}

#HoloScroll #个人成长`;
}

// 复制文本到剪贴板
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

// 生成分享图片
export async function generateShareImage(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }
  
  const canvas = await html2canvas(element, {
    backgroundColor: '#1c1c1c',
    scale: 2,
  });
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    });
  });
}

// 下载图片
export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 生成成就链接（本地模拟）
export function generateAchievementLink(achievementId: string): string {
  // 由于本地应用，生成一个模拟链接
  return `holoscroll://achievement/${achievementId}`;
}
