import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 복사할 다중 이미지 리스트 정의 (원본 경로, 대상 경로)
const filesToCopy = [
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/hero_office_split_layout_1785921268247.png',
    destName: 'hero-banner.png'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/about_korea_map_anyang_1785922260951.png',
    destName: 'about-map.png'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/service_pc_maintenance_1785922893986.png',
    destName: 'service-pc.png'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/service_copier_rental_1785922905969.png',
    destName: 'service-copier.png'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/service_gov_replace_1785922919759.png',
    destName: 'service-gov.png'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/461589c8-d33f-4abb-82d7-88156cc8311f/service_network_work_1785922932790.png',
    destName: 'service-network.png'
  },
  // 신규 추가: 포트폴리오 갤러리용 이미지
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/181146f3-8b24-4b07-8ff6-d7bb4e411d1b/work_pc_1786093997979.jpg',
    destName: 'gallery/work-pc.jpg'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/181146f3-8b24-4b07-8ff6-d7bb4e411d1b/work_server_1786094012663.jpg',
    destName: 'gallery/work-server.jpg'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/181146f3-8b24-4b07-8ff6-d7bb4e411d1b/work_network_1786094028167.jpg',
    destName: 'gallery/work-network.jpg'
  },
  {
    src: 'C:/Users/user/.gemini/antigravity/brain/181146f3-8b24-4b07-8ff6-d7bb4e411d1b/work_printer_1786094047102.jpg',
    destName: 'gallery/work-printer.jpg'
  }
];

const destDir = path.resolve(__dirname, 'assets');
const galleryDir = path.resolve(destDir, 'gallery');

try {
  // assets 디렉토리가 없으면 자동 생성
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  // gallery 디렉토리가 없으면 자동 생성
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
  }

  filesToCopy.forEach(file => {
    const destPath = path.resolve(destDir, file.destName);
    if (fs.existsSync(file.src)) {
      fs.copyFileSync(file.src, destPath);
      console.log(`✅ [나무테크] 이미지 복사 완료: assets/${file.destName}`);
    } else {
      console.warn(`⚠️ [나무테크] 원본 파일을 찾을 수 없습니다: ${file.src}`);
    }
  });
} catch (err) {
  console.error('❌ [나무테크] 이미지 자동 복사 실패:', err.message);
}
