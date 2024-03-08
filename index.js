import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import DangNhap from './src/components/DangNhap/dangNhap.js';
import TrangChu from './src/components/ManHinh/Pages/TiepNhan/TrangChu/TrangChu.js';
import TheoDoiDeNghi from './src/components/ManHinh/Pages/TiepNhan/TheoDoiDeNghi/TheoDoiDeNghi.js';
import ChiTetHoSo from './src/components/ManHinh/Pages/TiepNhan/ChiTietHoSo/ChiTietHoSo.js';
import Index from './src/components/ManHinh/Pages/index.js';
import chitietthutuc from './src/components/ManHinh/Pages/TiepNhan/ChiTietThuTuc/ChiTietThuTuc.js';
import soanhoso from './src/components/ManHinh/Pages/TiepNhan/SoanHoSo/soanhoso.js';

AppRegistry.registerComponent(appName, () => Index);
