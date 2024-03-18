import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import HeaderBack from '../../../Untils/HeaderBack';
import {MangQuyen} from '../DanhSachThuTuc/CBXL_DanhSachThuTuc';
import DatePicker from 'react-native-date-picker';
import {Button, DataTable, TextInput} from 'react-native-paper';
import {RadioButton} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {token} from '../../../../DangNhap/dangNhap';
import RNFS from 'react-native-fs';
import Index from '../..';
import CheckBox from '@react-native-community/checkbox';
import {
  ThongTinGiangVien,
  getThongTinhGiangVien,
} from '../../../../../api/GetThongTin/ThongTinGiangVien';
import {
  TEMPLATE_EMAIL_SUBJECT,
  sendEmailTTHCGV_CBNV_TP,
  sendEmailTTHCGV_TP_CBNV,
  sendEmailTTHCGiangVien,
} from './GuiEmail';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const Chitiethosoxuly = props => {
  const [openModal, setOpenModal] = useState(false);
  const [getIdGuiYeuCau, setIdGuiYeuCau] = useState(null);
  const [getTrangThai1, setTrangThai1] = useState('');
  const [thongTinHoSo, setThongTinHoSo] = useState([]);
  const [quaTrinhXuLy, setQuaTrinhXuLy] = useState([]);
  const [chiTietTiepNhanHoSo, setChiTietTiepNhanHoSo] = useState([]);

  const [hasData, setHasData] = useState(false);

  const Open = tt => {
    setOpenModal(true);
    setTrangThai1(tt);
  };

  const Close = () => {
    setOpenModal(false);
  };
  const [tabledata, setTableData] = useState([]);
  const [YeuCauID, setYeuCauID] = useState(0);
  const [TrangThaiSTT, setTrangThaiSTT] = useState(0);
  const [idThuTuc, setidThuTuc] = useState(props.route.params.IDGuiYeuCau);
  const [MangBuocHienHanh, setMangBuocHienHanh] = useState({});
  const [MangQuyTrinh, Setmangquytrinh] = useState([]);
  const retry = async (func, maxAttempts = 3, delay = 2000, backoff = 2) => {
    let attempt = 1;
    while (attempt <= maxAttempts) {
      try {
        const result = await func();
        return result;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        console.log(
          `Lần ${attempt} thất bại. Đang thử lại trong ${delay / 2000} giây...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoff;
        attempt++;
      }
    }
  };

  var getAPI1 = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_R_Para_File`;
  const getDataHoSo = async IDthutuc => {
    const callApi = async IDthutuc => {
      const response = await axios.get(getAPI1, {
        params: {MC_TTHC_GV_GuiYeuCau_ID: IDthutuc},
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTableData(await response.data.body[0]);
      // console.log(response.data.body[0]);
      console.log(
        'Trạng thái id:' + response.data.body[0].MC_TTHC_GV_TrangThai_STT,
      );
      console.log('ID thủ tục: ' + idThuTuc);
      setTrangThaiSTT(response.data.body[0].MC_TTHC_GV_TrangThai_STT + 1);
      setYeuCauID(response.data.body[0].MC_TTHC_GV_GuiYeuCau_YeuCau_ID);
    };
    try {
      await retry(() => callApi(IDthutuc));
    } catch (error) {
      console.error(error + 'Getdatahoso');
    }
  };
  const [tabledata2, setTableData2] = useState([]);
  var getAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_ThanhPhanHoSoTiepNhan/GuiYeuCau_Load_ByIDGuiYeuCau?MC_TTHC_GV_GuiYeuCau_ID=${idThuTuc}`;
  const getDataTabble = async () => {
    const callApi = async () => {
      const response = await axios.get(getAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTableData2(response.data.body);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdatatbale');
    }
  };
  useEffect(() => {
    if (tabledata2 === 0) return;
    getDataTabble();
  }, [tabledata2]);
  const [dataquytrinh, setquytrinh] = useState([]);
  const getDataQuyTrinh = async () => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_Load_ByIDGoc?MC_TTHC_GV_IDTTHC=${YeuCauID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setquytrinh(response.data.body);
      //console.log(response.data.body);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdataquytrinh');
    }
  };

  const getTrangThaiHienHanh = async () => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_GetID_BySTT?MC_TTHC_GV_GuiYeuCau_YeuCau_ID=${YeuCauID}&MC_TTHC_GV_TrangThai_STT=${TrangThaiSTT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data.body[0];
      console.log(data);
      setMangBuocHienHanh(data);
      //   console.log('data trạng thái hiện hành: '+
      // await response.data.body[0]);
      console.log(data);

      console.log('Trạng thái id:' + TrangThaiSTT + ' ID Yeu Cau: ' + YeuCauID);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdatatrangthaihienhanh');
    }
  };
  const getQuytrinhXuly = async () => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_CBNV_TheoDoi_QuyTrinhXuLy_Load_Para?MC_TTHC_GV_GuiYeuCau_ID=${idThuTuc}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data.body;
      console.log(data);
      Setmangquytrinh(data);
      //   console.log('data trạng thái hiện hành: '+
      // await response.data.body[0]);
      console.log(data);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdataquytrinhxuly');
    }
  };
  useEffect(() => {
    getQuytrinhXuly();
  }, []);

  useEffect(() => {
    getDataHoSo(idThuTuc);
  }, []);

  useEffect(() => {
    if (TrangThaiSTT === 0 || YeuCauID === 0) return;
    getDataQuyTrinh();
    getTrangThaiHienHanh();
  }, [TrangThaiSTT, YeuCauID]);

  ///// Lấy trạng thái cần hoàn thành

  const [checked, setChecked] = useState('Pheduyet');
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
    {label: 'Phê duyệt', value: '0'},
    {label: 'Không phê duyệt', value: '1'},
    {label: 'Trình duyệt', value: '2'},
  ];

  useEffect(() => {
    if (!isSecondViewVisible) {
      setFirstViewHeight(20); // Reset height if second view is visible
    } else {
      setFirstViewHeight(600); // Set height to 50 when second view is invisible
    }
  });
  const [status, setstatus] = useState(true);
  const [status1, setstatus1] = useState(true);
  const [status2, setstatus2] = useState(true);
  const [status3, setstatus3] = useState(true);

  const [isSecondViewVisible, setIsSecondViewVisible] = useState(true);
  const [firstViewHeight, setFirstViewHeight] = useState(600);
  const [open, setopen] = useState(false);
  const [ngaygui, setngaygui] = useState(new Date());
  const handlePress = () => {
    setopen(!open); // Chuyển đổi giá trị của 'open'
  };

  const [checkedNNHS, setCheckedNNHS] = useState(true);
  const [checkedCBXL, setCheckedCBXL] = useState(true);
  const [checkedTPDV, setCheckedTPDV] = useState(true);
  const [checkboxColor, setCheckboxColor] = useState('#245d7c');
  const [checkboxUncheckedColor, setCheckboxUncheckedColor] = useState('gray');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled1, setIsDisabled1] = useState(false);
  const [noidung, setnoidung] = useState('');
  const [link, setlink] = useState('');
  const [diadiem, setdiadiem] = useState('');
  useEffect(() => {
    if (MangQuyen[0] === '16' || MangQuyen[0] === '24') {
      setIsDisabled(!isDisabled);
    }
    if (MangQuyen[0] === '16' || MangQuyen[0] === '25') {
      setIsDisabled1(!isDisabled1);
    }
    console.log('Data quyen: ' + MangQuyen);
  }, []);
  const [FileName, setFileName] = useState('');
  const [base64Content, setBase64] = useState('');
  const readFileAsBase64 = async fileUri => {
    try {
      const base64Data = await RNFS.readFile(fileUri, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };
  ///Chọn File
  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,
      });
      console.log(res[0].uri);
      setFileName(res[0].name);
      const base64Content1 = await readFileAsBase64(res[0].uri);
      setBase64('data:' + res[0].type + ';base64,' + base64Content1);
      console.log(base64Content);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        console.error('Lỗi:', err);
      }
    }
  };
  useEffect(() => {
    getThongTinhGiangVien();
  }, []);
  var PutAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Edit_Para`;
  const PostYeuCau = async () => {
    var postdata = {
      MC_TTHC_GV_GuiYeuCau_ID: idThuTuc,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
      MC_TTHC_GV_GuiYeuCau_YeuCau_ID: YeuCauID,
      MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
        tabledata.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
      MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
        MangBuocHienHanh.MC_TTHC_GV_TrangThai_ID,
      MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
        MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai,
      MC_TTHC_GV_GuiYeuCau_NgayGui: moment
        .utc(moment(), 'DD/MM/YYYY')
        .toISOString(),
      MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
        tabledata.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
      MC_TTHC_GV_GuiYeuCau_DaNop: tabledata.MC_TTHC_GV_GuiYeuCau_DaNop,
      MC_TTHC_GV_GuiYeuCau_NgayHenTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: 'FileName',
      MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: 'base64Content',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: 1,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: 'string',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: 1,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: 'string',
      MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
      MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
        tabledata.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
      MC_TTHC_GV_GuiYeuCau_NguonTiepNhan:
        tabledata.MC_TTHC_GV_GuiYeuCau_NguonTiepNhan,
    };
    console.log(postdata);
    try {
      const response = await axios.put(PutAPI, postdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message === 'Bản ghi bị trùng.') {
        // handleModalPress();
        Alert.alert('Thành công');
      } else {
        if (response.status == 200) {
          // handleModalPress1();
          Alert.alert('Thành công');
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  var SendEmail = `https://apiv2.uneti.edu.vn/api/send-email/Verifier`;
  const sendEmail = async acTion => {
    const {contentReply, emailHtml, subjectEmail} = sendEmailTTHCGiangVien({
      action: acTion,
      contentSubject: 'Send email',
      dataUserSuggest: tabledata,
      dataUserHandle: {
        HoDem: ThongTinGiangVien.HoDem,
        Ten: ThongTinGiangVien.Ten,
        Email: ThongTinGiangVien.Email,
        SoDienThoai: ThongTinGiangVien.SoDienThoai,
      },
      listThanhPhanHoSo: [],
      contentReply: noidung,
    });

    const data = {
      to: 'vuson20022020@gmail.com', //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: contentReply, //Nội dung email
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thành công');
      } else {
        if (response.status == 200) {
          Alert.alert('Thành công');
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const sendEmail1 = async () => {
    const {subjectEmail, emailHtml, contentEmail} = sendEmailTTHCGV_CBNV_TP({
      contentSubject: 'Send Email',
      dataUserSuggest: tabledata,
      dataUserHandle: {
        HoDem: ThongTinGiangVien.HoDem,
        Ten: ThongTinGiangVien.Ten,
        Email: ThongTinGiangVien.Email,
        SoDienThoai: ThongTinGiangVien.SoDienThoai,
      },
      listThanhPhanHoSo: [],
      contentEmail: noidung,
    });

    const data = {
      to: 'vuson20022020@gmail.com', //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: contentEmail, //Nội dung email
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thành công');
      } else {
        if (response.status == 200) {
          Alert.alert('Thành công');
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const sendEmail2 = async acTion => {
    const {emailHtml, subjectEmail, listThanhPhanHoSoHtml, noiDungLyDo} =
      sendEmailTTHCGV_TP_CBNV({
        contentSubject: '',
        dataUserSuggest: tabledata,
        dataUserHandleƠ: {
          HoDem: ThongTinGiangVien.HoDem,
          Ten: ThongTinGiangVien.Ten,
          Email: ThongTinGiangVien.Email,
          SoDienThoai: ThongTinGiangVien.SoDienThoai,
        },
        listThanhPhanHoSo: [],
        noiDungLyDo: noidung,
        tenFileKemTheo: FileName,
        dataFileKemTheo: base64Content,
        toEmailCBNV: 'vuson20022020@gmail.com',
      });

    const data = {
      to: 'vuson20022020@gmail.com', //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: noiDungLyDo, //Nội dung email
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thành công');
      } else {
        if (response.status == 200) {
          Alert.alert('Thành công');
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="CHI TIẾT XỬ LÝ HỒ SƠ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView>
        <View>
          <View style={styles.tieudelon}>
            <TouchableOpacity
              onPress={() => {
                setstatus(!status);
              }}>
              {status ? (
                <Image
                  source={require('../../../../../images/minus.png')}
                  style={{width: 20, height: 20}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/add.png')}
                  style={{width: 20, height: 20}}
                />
              )}
            </TouchableOpacity>

            <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
              Thông tin người nộp hồ sơ
            </Text>
          </View>
          {status ? (
            <View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Mã nhân sự: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Họ và tên: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.HoTen}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Ngày sinh: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {moment(tabledata.NgaySinh).format('DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Email: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Đơn vị: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.tieudelon}>
            <TouchableOpacity
              onPress={() => {
                setstatus1(!status1);
              }}>
              {status1 ? (
                <Image
                  source={require('../../../../../images/minus.png')}
                  style={{width: 20, height: 20}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/add.png')}
                  style={{width: 20, height: 20}}
                />
              )}
            </TouchableOpacity>

            <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
              Thông tin hồ sơ
            </Text>
          </View>
          {status1 ? (
            <View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Lĩnh vực: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_LinhVuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Tên thủ tục: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_TenThuTuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Mã thủ tục: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_MaThuTuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Mức độ thủ tục: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_IDMucDo}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Ngày nộp hồ sơ: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {moment(tabledata.MC_TTHC_GV_GuiYeuCau_NgayGui).format(
                      'DD/MM/YYYY',
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Đơn vị tiếp nhận: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_NoiTiepNhan}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={[styles.TextBold, {marginLeft: 30}]}>
                  Giấy tờ kèm theo:
                </Text>
                <ScrollView horizontal>
                  <DataTable
                    style={{
                      width: 500,
                      marginLeft: -10,
                      marginRight: -10,
                      marginBottom: 10,
                      marginTop: 5,
                    }}>
                    <DataTable.Header>
                      <DataTable.Title
                        style={[
                          {
                            flex: 0.1,
                            borderTopLeftRadius: 10,
                          },
                          styles.TitleTable,
                        ]}>
                        <Text style={[styles.TextBold, {color: 'white'}]}>
                          STT
                        </Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={[
                          {
                            flex: 0.6,
                          },
                          styles.TitleTable,
                        ]}>
                        <Text style={[styles.TextBold, {color: 'white'}]}>
                          Tên giấy tờ
                        </Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={[
                          {
                            flex: 0.4,
                            borderTopRightRadius: 10,
                          },
                          styles.TitleTable,
                        ]}>
                        <Text style={[styles.TextBold, {color: 'white'}]}>
                          Giấy tờ kèm theo
                        </Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {tabledata2
                      ? tabledata2.map((td, index) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell
                              style={[
                                styles.CellTableFirst,
                                {
                                  flex: 0.1,
                                },
                              ]}>
                              <Text style={styles.TextNormal}>{++index}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                              style={[
                                styles.CellTableFirst,
                                {
                                  flex: 0.6,
                                },
                              ]}>
                              <Text style={styles.TextNormal}>
                                {td.MC_TTHC_GV_ThanhPhanHoSo_TenGiayTo}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                              style={[
                                styles.CellTableFirst,
                                {
                                  flex: 0.4,
                                },
                              ]}>
                              <Text style={styles.TextNormal}>Xem</Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))
                      : null}
                  </DataTable>
                </ScrollView>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.tieudelon}>
          <TouchableOpacity
            onPress={() => {
              setstatus2(!status2);
            }}>
            {status2 ? (
              <Image
                source={require('../../../../../images/minus.png')}
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={require('../../../../../images/add.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </TouchableOpacity>

          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Quy trình xử lý
          </Text>
        </View>

        {dataquytrinh.map(td => (
          <View style={{marginTop: -10}}>
            <View style={{flexDirection: 'row'}}>
              {td.MC_TTHC_GV_TrangThai_STT < TrangThaiSTT ? (
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/dry-clean.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
              )}

              {td.MC_TTHC_GV_TrangThai_STT < TrangThaiSTT ? (
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                    {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              ) : (
                <View style={[styles.tieudebuoc1]}>
                  <Text style={styles.texttieudebuoc1}>
                    Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                    {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              )}
            </View>

            {MangBuocHienHanh != null ? (
              MangBuocHienHanh.MC_TTHC_GV_TrangThai_ID ===
              td.MC_TTHC_GV_TrangThai_ID ? (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: firstViewHeight,
                      marginTop: -10,
                      width: 1,
                      borderWidth: 1,
                      backgroundColor: '#2e6b8b',
                      borderColor: '#2e6b8b',
                      marginLeft: 28,
                    }}
                  />
                  {MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                  'Tiếp nhận hồ sơ' ? (
                    <View style={[styles.noidungtungbuoc]}>
                      <Text
                        style={[
                          styles.TextBold,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        THÔNG BÁO
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {marginLeft: 15, textAlign: 'left'},
                        ]}>
                        Gửi email:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          borderWidth: 1,
                          borderRadius: 5,
                          marginLeft: 15,
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CheckBox
                            value={checkedNNHS}
                            tintColors={{
                              true: checkboxColor,
                              false: checkboxUncheckedColor,
                            }}
                          />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Người nộp hồ sơ
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Nội dung:
                      </Text>
                      <TextInput
                        style={{
                          width: '91%',
                          marginLeft: 15,
                          backgroundColor: '#ffffff',
                          marginRight: 15,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 70,
                        }}
                        value={noidung}
                        onChangeText={text => setnoidung(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Tài liệu kèm theo:
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Links tệp đính kèm:
                      </Text>
                      <TextInput
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                        }}
                        placeholder="Nhập link tệp đính kèm"
                        value={link}
                        onChangeText={text => setlink(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Hoặc
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm:
                      </Text>
                      <View
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            chooseFile();
                          }}
                          style={{
                            borderRadius: 5,
                            borderWidth: 1,
                            width: '30%',
                            backgroundColor: '#C0C0C0',
                            marginLeft: 2,
                            marginTop: 2,
                            marginBottom: 2,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Chọn tệp
                          </Text>
                        </TouchableOpacity>
                        <View style={{width: '69%', justifyContent: 'center'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.TextNormal,
                              {marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName ? FileName : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm phải có dạng PDF
                      </Text>
                      <Text
                        style={[
                          styles.TextBold,
                          {
                            textAlign: 'left',
                            color: 'red',
                            marginLeft: 30,
                            marginTop: 1,
                          },
                        ]}>
                        (Kích thước tối đa 5 MB)
                      </Text>
                      <View style={styles.viewFooter}>
                        <View
                          style={[
                            styles.buttonHuy,
                            {marginLeft: 30, backgroundColor: '#245d7c'},
                          ]}>
                          <TouchableOpacity
                            style={styles.touchableOpacity}
                            onPress={() => {
                              PostYeuCau();
                              sendEmail(TEMPLATE_EMAIL_SUBJECT.RECEIVED);
                            }}>
                            <Text style={{color: 'white', fontSize: 18}}>
                              Tiếp nhận
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonHuy, {marginRight: 30}]}>
                          <TouchableOpacity
                            style={[
                              styles.touchableOpacity,
                              {backgroundColor: 'red'},
                            ]}
                            onPress={() => {
                              if (dataTable.length == 0) {
                                handleModalPress1();
                              } else {
                                if (!kiemTraChonMonHoc) {
                                  handleModalPress2();
                                } else {
                                  PostYeuCau();
                                }
                              }
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 19}}>
                              Hủy trả
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                    'Xử lý hồ sơ' ? (
                    <View style={[styles.noidungtungbuoc]}>
                      <Text
                        style={[
                          styles.TextBold,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        THÔNG BÁO
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {marginLeft: 15, textAlign: 'left'},
                        ]}>
                        Gửi email:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          borderWidth: 1,
                          borderRadius: 5,
                          marginLeft: 15,
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CheckBox
                            value={!checkedNNHS}
                            onValueChange={() => {
                              setCheckedNNHS(!checkedNNHS);
                            }}
                            tintColors={{
                              true: checkboxColor,
                              false: checkboxUncheckedColor,
                            }}
                          />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Người nộp hồ sơ
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginLeft: 15}}>
                          <CheckBox
                            value={checkedTPDV}
                            tintColors={{
                              true: checkboxColor,
                              false: checkboxUncheckedColor,
                            }}
                          />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Trưởng/phó đơn vị
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Nội dung:
                      </Text>
                      <TextInput
                        style={{
                          width: '91%',
                          marginLeft: 15,
                          backgroundColor: '#ffffff',
                          marginRight: 15,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 70,
                        }}
                        value={noidung}
                        onChangeText={text => setnoidung(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Tài liệu kèm theo:
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Links tệp đính kèm:
                      </Text>
                      <TextInput
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                        }}
                        placeholder="Nhập link tệp đính kèm"
                        value={link}
                        onChangeText={text => setlink(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Hoặc
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm:
                      </Text>
                      <View
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            chooseFile();
                          }}
                          style={{
                            borderRadius: 5,
                            borderWidth: 1,
                            width: '30%',
                            backgroundColor: '#C0C0C0',
                            marginLeft: 2,
                            marginTop: 2,
                            marginBottom: 2,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Chọn tệp
                          </Text>
                        </TouchableOpacity>
                        <View style={{width: '69%', justifyContent: 'center'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.TextNormal,
                              {marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName ? FileName : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm phải có dạng PDF
                      </Text>
                      <Text
                        style={[
                          styles.TextBold,
                          {
                            textAlign: 'left',
                            color: 'red',
                            marginLeft: 30,
                            marginTop: 1,
                          },
                        ]}>
                        (Kích thước tối đa 5 MB)
                      </Text>
                      <View style={styles.viewFooter}>
                        <View
                          style={[
                            styles.buttonHuy,
                            {marginLeft: 30, backgroundColor: '#245d7c'},
                          ]}>
                          <TouchableOpacity
                            style={styles.touchableOpacity}
                            onPress={() => {
                              PostYeuCau();
                              if (checkedNNHS === true) {
                                sendEmail(TEMPLATE_EMAIL_SUBJECT.PENDING);
                              }
                              sendEmail1();
                            }}>
                            <Text style={{color: 'white', fontSize: 18}}>
                              Tiếp nhận
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonHuy, {marginRight: 30}]}>
                          <TouchableOpacity
                            style={[
                              styles.touchableOpacity,
                              {backgroundColor: 'red'},
                            ]}
                            onPress={() => {
                              if (dataTable.length == 0) {
                                handleModalPress1();
                              } else {
                                if (!kiemTraChonMonHoc) {
                                  handleModalPress2();
                                } else {
                                  PostYeuCau();
                                }
                              }
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 19}}>
                              Hủy trả
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'Trưởng phòng phê duyệt' ||
                    MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'Trưởng/Phó đơn vị phê duyệt' ||
                    MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'Trưởng/Phó Đơn vị' ||
                    MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'Trưởng/Phó Đơn vị phê duyệt' ? (
                    <View
                      style={[
                        styles.noidungtungbuoc,
                        isDisabled1 && styles.disabled,
                      ]}>
                      <Text
                        style={[
                          styles.TextBold,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        THÔNG BÁO
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {marginLeft: 15, textAlign: 'left'},
                        ]}>
                        Gửi email:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          borderWidth: 1,
                          borderRadius: 5,
                          marginLeft: 15,
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CheckBox
                            value={checkedCBXL}
                            onValueChange={() => {
                              setCheckedCBXL(!checkedCBXL);
                            }}
                            tintColors={{
                              true: checkboxColor,
                              false: checkboxUncheckedColor,
                            }}
                          />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Cán bộ xử lý
                          </Text>
                        </View>
                      </View>
                      <RadioButton.Group
                        onValueChange={newValue => setChecked(newValue)}
                        value={checked}>
                        <View style={{marginLeft: 5}}>
                          <View style={[styles.radioItem, {marginLeft: 5}]}>
                            <RadioButton
                              value="Pheduyet"
                              color="black"
                              uncheckedColor="black"
                            />
                            <Text style={styles.modalText}>Phê duyệt</Text>
                          </View>
                          <View style={[styles.radioItem, {marginLeft: 5}]}>
                            <RadioButton
                              value="Khongpheduyet"
                              color="black"
                              uncheckedColor="black"
                            />
                            <Text style={styles.modalText}>
                              Không phê duyệt
                            </Text>
                          </View>
                          <View style={[styles.radioItem, {marginLeft: 5}]}>
                            <RadioButton
                              value="Trinhduyet"
                              color="black"
                              uncheckedColor="black"
                            />
                            <Text style={styles.modalText}>Trình duyệt</Text>
                          </View>
                        </View>
                      </RadioButton.Group>

                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Nội dung:
                      </Text>
                      <TextInput
                        style={{
                          width: '91%',
                          marginLeft: 15,
                          backgroundColor: '#ffffff',
                          marginRight: 15,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 70,
                        }}
                        value={noidung}
                        onChangeText={text => setnoidung(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Tài liệu kèm theo:
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Links tệp đính kèm:
                      </Text>
                      <TextInput
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                        }}
                        placeholder="Nhập links tệp đính kèm"
                        value={link}
                        onChangeText={text => setlink(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Hoặc
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm:
                      </Text>
                      <View
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            chooseFile();
                          }}
                          style={{
                            borderRadius: 5,
                            borderWidth: 1,
                            width: '30%',
                            backgroundColor: '#C0C0C0',
                            marginLeft: 2,
                            marginTop: 2,
                            marginBottom: 2,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Chọn tệp
                          </Text>
                        </TouchableOpacity>
                        <View style={{width: '69%', justifyContent: 'center'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.TextNormal,
                              {marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName ? FileName : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm phải có dạng PDF
                      </Text>
                      <Text
                        style={[
                          styles.TextBold,
                          {
                            textAlign: 'left',
                            color: 'red',
                            marginLeft: 30,
                            marginTop: 1,
                          },
                        ]}>
                        (Kích thước tối đa 5 MB)
                      </Text>
                      <View style={styles.viewFooter}>
                        <View
                          style={[
                            styles.buttonHuy,
                            {marginLeft: 30, backgroundColor: '#245d7c'},
                          ]}>
                          <TouchableOpacity
                            style={styles.touchableOpacity}
                            onPress={() => {
                              PostYeuCau();
                              sendEmail1();
                            }}>
                            <Text style={{color: 'white', fontSize: 18}}>
                              Tiếp nhận
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonHuy, {marginRight: 30}]}>
                          <TouchableOpacity
                            style={[
                              styles.touchableOpacity,
                              {backgroundColor: 'red'},
                            ]}
                            onPress={() => {
                              if (dataTable.length == 0) {
                                handleModalPress1();
                              } else {
                                if (!kiemTraChonMonHoc) {
                                  handleModalPress2();
                                } else {
                                  PostYeuCau();
                                }
                              }
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 19}}>
                              Hủy trả
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'BGH Phê duyệt' ||
                    MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                      'Ban giám hiệu phê duyệt' ? (
                    <View
                      style={[
                        styles.noidungtungbuoc,
                        isDisabled && styles.disabled,
                      ]}>
                      <Text
                        style={[
                          styles.TextBold,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        THÔNG BÁO
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {marginLeft: 15, textAlign: 'left'},
                        ]}>
                        Gửi email:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          borderWidth: 1,
                          borderRadius: 5,
                          marginLeft: 15,
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CheckBox />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Người nộp hồ sơ
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginLeft: 15}}>
                          <CheckBox />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Trưởng/phó đơn vị
                          </Text>
                        </View>
                      </View>
                      <RadioButton.Group
                        onValueChange={newValue => setChecked(newValue)}
                        value={checked}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={[styles.radioItem, {marginLeft: 15}]}>
                            <RadioButton
                              value="Pheduyet"
                              color="black"
                              uncheckedColor="black"
                            />
                            <Text style={styles.modalText}>Phê duyệt</Text>
                          </View>
                          <View style={[styles.radioItem, {marginLeft: 50}]}>
                            <RadioButton
                              value="Khongpheduyet"
                              color="black"
                              uncheckedColor="black"
                            />
                            <Text style={styles.modalText}>
                              Không phê duyệt
                            </Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Nội dung:
                      </Text>
                      <TextInput
                        style={{
                          width: '91%',
                          marginLeft: 15,
                          backgroundColor: '#ffffff',
                          marginRight: 15,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 70,
                        }}
                        value={nd}
                        onChangeText={text => setnoidung(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Tài liệu kèm theo:
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Links tệp đính kèm:
                      </Text>
                      <TextInput
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                        }}
                        value={link}
                        onChangeText={text => setlink(link)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Hoặc
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm:
                      </Text>
                      <View
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            chooseFile();
                          }}
                          style={{
                            borderRadius: 5,
                            borderWidth: 1,
                            width: '30%',
                            backgroundColor: '#C0C0C0',
                            marginLeft: 2,
                            marginTop: 2,
                            marginBottom: 2,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Chọn tệp
                          </Text>
                        </TouchableOpacity>
                        <View style={{width: '69%', justifyContent: 'center'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.TextNormal,
                              {marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName ? FileName : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm phải có dạng PDF
                      </Text>
                      <Text
                        style={[
                          styles.TextBold,
                          {
                            textAlign: 'left',
                            color: 'red',
                            marginLeft: 30,
                            marginTop: 1,
                          },
                        ]}>
                        (Kích thước tối đa 5 MB)
                      </Text>
                      <View style={styles.viewFooter}>
                        <View
                          style={[
                            styles.buttonHuy,
                            {marginLeft: 30, backgroundColor: '#245d7c'},
                          ]}>
                          <TouchableOpacity
                            style={styles.touchableOpacity}
                            onPress={() => {
                              // getDataTabble();
                              PostYeuCau();
                              sendEmail(TEMPLATE_EMAIL_SUBJECT.PENDING);
                            }}>
                            <Text style={{color: 'white', fontSize: 18}}>
                              Tiếp nhận
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonHuy, {marginRight: 30}]}>
                          <TouchableOpacity
                            style={[
                              styles.touchableOpacity,
                              {backgroundColor: 'red'},
                            ]}
                            onPress={() => {}}>
                            <Text style={{color: '#ffffff', fontSize: 19}}>
                              Hủy trả
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
                    'Trả kết quả' ? (
                    <View style={[styles.noidungtungbuoc]}>
                      <Text
                        style={[
                          styles.TextBold,
                          {marginTop: 5, textAlign: 'center'},
                        ]}>
                        THÔNG BÁO
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {marginLeft: 15, textAlign: 'left'},
                        ]}>
                        Gửi email:
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          borderWidth: 1,
                          borderRadius: 5,
                          marginLeft: 15,
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <CheckBox />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Người nộp hồ sơ
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row', marginLeft: 15}}>
                          <CheckBox />
                          <Text
                            style={[
                              styles.TextNormal,
                              {alignItems: 'center', marginTop: 7},
                            ]}>
                            Trưởng/phó đơn vị
                          </Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{marginTop: 10, marginLeft: 15}}>
                          <Text
                            style={[styles.TextNormal, {textAlign: 'left'}]}>
                            Ngày giờ hẹn trả
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                              onPress={handlePress}
                              style={{
                                flexDirection: 'row',
                                borderWidth: 1,
                                width: '65%',
                                borderRadius: 5,
                              }}>
                              <DatePicker
                                modal
                                mode="date"
                                open={open}
                                date={ngaygui}
                                onConfirm={ngaygui => {
                                  setopen(false);
                                  setngaygui(ngaygui);
                                }}
                                onCancel={() => {
                                  setopen(false);
                                }}
                              />
                              <TextInput
                                readOnly={true}
                                style={{
                                  height: 30,
                                  width: '75%',
                                  backgroundColor: '#ffffff',
                                }}
                                value={ngaygui
                                  .toLocaleDateString('vi-VN')
                                  .toString()}
                              />

                              <Image
                                source={require('../../../../../images/calendar.png')}
                                style={{
                                  width: 25,
                                  height: 25,
                                  marginTop: 2.5,
                                  marginLeft: 5,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{marginTop: 10, marginLeft: -10}}>
                          <Text
                            style={[styles.TextNormal, {textAlign: 'left'}]}>
                            Địa điểm hẹn trả
                          </Text>
                          <TextInput
                            style={{
                              height: 30,
                              borderRadius: 5,
                              borderWidth: 1,
                              backgroundColor: '#ffffff',
                            }}
                            onChangeText={text => setdiadiem(text)}
                            value={diadiem}
                          />
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Nội dung:
                      </Text>
                      <TextInput
                        style={{
                          width: '91%',
                          marginLeft: 15,
                          backgroundColor: '#ffffff',
                          marginRight: 15,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 70,
                        }}
                        value={noidung}
                        onChangeText={text => setnoidung(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 15, marginTop: 5},
                        ]}>
                        Tài liệu kèm theo:
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Links tệp đính kèm:
                      </Text>
                      <TextInput
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                        }}
                        placeholder="Nhập links tệp đính kèm"
                        value={link}
                        onChangeText={text => setlink(text)}
                      />
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Hoặc
                      </Text>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm:
                      </Text>
                      <View
                        style={{
                          width: '87%',
                          marginLeft: 30,
                          backgroundColor: '#ffffff',
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 30,
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            chooseFile();
                          }}
                          style={{
                            borderRadius: 5,
                            borderWidth: 1,
                            width: '30%',
                            backgroundColor: '#C0C0C0',
                            marginLeft: 2,
                            marginTop: 2,
                            marginBottom: 2,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 16,
                              textAlign: 'center',
                            }}>
                            Chọn tệp
                          </Text>
                        </TouchableOpacity>
                        <View style={{width: '69%', justifyContent: 'center'}}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.TextNormal,
                              {marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName ? FileName : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginLeft: 30, marginTop: 1},
                        ]}>
                        Tệp đính kèm phải có dạng PDF
                      </Text>
                      <Text
                        style={[
                          styles.TextBold,
                          {
                            textAlign: 'left',
                            color: 'red',
                            marginLeft: 30,
                            marginTop: 1,
                          },
                        ]}>
                        (Kích thước tối đa 5 MB)
                      </Text>
                      <View style={styles.viewFooter}>
                        <View
                          style={[
                            styles.buttonHuy,
                            {marginLeft: 30, backgroundColor: '#245d7c'},
                          ]}>
                          <TouchableOpacity
                            style={styles.touchableOpacity}
                            onPress={() => {
                              sendEmail(TEMPLATE_EMAIL_SUBJECT.SUCCESS);
                              PostYeuCau();
                              //  sendEmailTTHCGiangVien('',MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai,tabledata,tabledata,tabledata2.MC_TTHC_GV_ThanhPhanHoSo_TenGiayTo,noidung,FileName,base64Content,'vuhoaingoc1608@gmail.com');
                            }}>
                            <Text style={{color: 'white', fontSize: 18}}>
                              Tiếp nhận
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.buttonHuy, {marginRight: 30}]}>
                          <TouchableOpacity
                            style={[
                              styles.touchableOpacity,
                              {backgroundColor: 'red'},
                            ]}
                            onPress={() => {
                              // if (dataTable.length == 0) {
                              //   handleModalPress1();
                              // } else {
                              //   if (!kiemTraChonMonHoc) {
                              //     handleModalPress2();
                              //   } else {
                              //     PostYeuCau();
                              //   }
                              // }
                            }}>
                            <Text style={{color: '#ffffff', fontSize: 19}}>
                              Hủy trả
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null
            ) : null}
          </View>
        ))}

        <View style={styles.tieudelon}>
          <TouchableOpacity
            onPress={() => {
              // setstatus3(!status3);
              sendEmail1();
            }}>
            {status3 ? (
              <Image
                source={require('../../../../../images/minus.png')}
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={require('../../../../../images/add.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </TouchableOpacity>

          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Quá trình xử lý hồ sơ
          </Text>
        </View>
        {status3 ? (
          <View style={styles.danhSachThuTucTieuDe}>
            <View style={styles.viewBuoc}>
              <Text style={styles.textWhite}>Bước</Text>
            </View>

            <View style={styles.viewTenCongViec}>
              <Text style={styles.textWhite}>Công việc</Text>
            </View>

            <View style={styles.viewNgayXuLy}>
              <Text style={styles.textWhite}>Ngày xử lý</Text>
            </View>
          </View>
        ) : null}
        {MangQuyTrinh
          ? MangQuyTrinh.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Open(item.trangThai);
                }}>
                <View style={styles.chiTietDanhSachHoSo}>
                  <View style={styles.chiTietViewBuoc}>
                    <Text style={styles.text}>
                      {item.MC_TTHC_GV_TrangThai_STT}
                    </Text>
                  </View>
                  <View style={styles.chiTietViewTenCongViec}>
                    <Text style={styles.text}>
                      {item.MC_TTHC_GV_TrangThai_TenTrangThai}
                    </Text>
                  </View>
                  <View style={styles.chiTietViewNgayXuLy}>
                    <Text style={styles.text}>
                      {item.MC_TTHC_GV_GuiYeuCau_DateEditor
                        ? moment(item.MC_TTHC_GV_GuiYeuCau_DateEditor).format(
                            'DD/MM/YYYY HH:mm:ss',
                          )
                        : ''}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          : null}
        <Modal
          animationType="fade"
          transparent={true}
          visible={openModal}
          onRequestClose={Close}>
          <View style={styles.containerModal}>
            <View style={styles.modalView}>
              <View style={styles.viewTextAndClose}>
                <Text style={styles.TitleText}>
                  Chi tiết thực hiện của công việc:
                </Text>
              </View>

              <Text
                style={[
                  styles.TitleText,
                  {
                    textDecorationLine: 'underline',
                    marginTop: 10,
                    marginBottom: 10,
                  },
                ]}>
                {getTrangThai1}
              </Text>

              <View style={styles.danhSachThuTucTieuDe}>
                <View style={styles.viewSTT}>
                  <Text style={styles.textWhite1}>STT</Text>
                </View>

                <View style={styles.viewNguoiXyLy}>
                  <Text style={styles.textWhite1}>Người xử lý</Text>
                </View>

                <View style={styles.viewNgayHenTra}>
                  <Text style={styles.textWhite1}>Ngày hẹn trả</Text>
                </View>

                <View style={styles.viewNoiTraKetQua}>
                  <Text style={styles.textWhite1}>Nơi trả kết quả</Text>
                </View>
                <View style={styles.viewNgayXuLi}>
                  <Text style={styles.textWhite1}>Ngày xử lý</Text>
                </View>
              </View>

              {MangQuyTrinh.length !== 0 ? (
                MangQuyTrinh.map((item, index) => (
                  <View style={styles.chiTietDanhSachHoSo1} key={index}>
                    <View style={styles.viewChiTietSTT}>
                      <Text style={styles.text1}>{index + 1}</Text>
                    </View>

                    <View style={styles.viewChiTietNguoiXyLy}>
                      <Text style={styles.text1}>{item.HoTen} </Text>
                    </View>

                    <View style={styles.viewChiTietNgayHenTra}>
                      <Text style={styles.text1}>
                        {item.MC_TTHC_GV_GuiYeuCau_NgayHenTra
                          ? moment(item.MC_TTHC_GV_GuiYeuCau_NgayHenTra).format(
                              'DD/MM/YYYY HH:mm:ss',
                            )
                          : ''}
                      </Text>
                    </View>

                    <View style={styles.viewChiTietNoiTraKetQua}>
                      <Text style={styles.text1}>
                        {item.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua}{' '}
                      </Text>
                    </View>

                    <View style={styles.viewChiTietNgayXuLy}>
                      <Text style={styles.text1}>
                        {item.MC_TTHC_GV_GuiYeuCau_DateEditor
                          ? moment(item.MC_TTHC_GV_GuiYeuCau_DateEditor).format(
                              'DD/MM/YYYY HH:mm:ss',
                            )
                          : ''}
                      </Text>
                    </View>
                  </View>
                ))
              ) : hasData ? (
                <View style={styles.viewNoData}>
                  <Text style={styles.textNoData}>Không có dữ liệu!</Text>
                </View>
              ) : (
                <View style={styles.viewModel}>
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator
                      color="gray"
                      size="small"
                      style={{borderRadius: 10, overflow: 'hidden'}}
                    />
                    <Text style={{color: 'gray', fontSize: 20, marginLeft: 15}}>
                      Vui lòng đợi...
                    </Text>
                  </View>
                </View>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={Close}>
                <Text style={styles.textStyle}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Chitiethosoxuly;
const styles = StyleSheet.create({
  disabled: {
    pointerEvents: 'none',
    opacity: 0.6,
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    alignItems: 'center',
    width: 0.95 * getWidth,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 8,
    shadowRadius: 4,
    elevation: 10,
  },

  closeButton: {
    width: '100%',
    borderTopWidth: 0.3,
    marginTop: 10,
    borderColor: 'gray',
  },

  textStyle: {
    fontSize: 21,
    color: '#1e90ff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  TitleText: {
    color: 'black',
    fontSize: 21,
    fontWeight: 'bold',
  },

  text1: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
  chiTietDanhSachHoSo1: {
    width: 0.9 * getWidth,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 65,
    marginBottom: 13,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
  },

  viewChiTietSTT: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNguoiXyLy: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNgayHenTra: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNoiTraKetQua: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNgayXuLy: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8ff',
  },

  viewTextAndClose: {
    flexDirection: 'row',
  },

  viewModel: {
    height: 60,
    width: 160,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  viewModalCotainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewNoData: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  textNoData: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
  viewSTT: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
    marginLeft: 20,
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNguoiXyLy: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNgayHenTra: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNoiTraKetQua: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNgayXuLi: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },

  textWhite1: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chiTietViewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },
  text: {
    color: 'black',
    fontSize: 17,
  },
  chiTietViewTenCongViec: {
    width: 162,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },
  chiTietViewNgayXuLy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },
  chiTietDanhSachHoSo: {
    marginLeft: 6,
    width: 399,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 67,
    marginBottom: 13,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
  },
  viewNgayXuLy: {
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  viewTenCongViec: {
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginLeft: 1.5,
    marginRight: 1.5,
  },

  viewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
  },
  danhSachThuTucTieuDe: {
    flexDirection: 'row',
    height: 35,
    marginBottom: 7,
    marginTop: 8,
    justifyContent: 'center',
  },
  viewFooter: {
    height: '10%',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    marginLeft: 15,
    marginTop: 20,
  },
  touchableOpacity: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    shadowColor: 'black',
  },
  buttonHuy: {
    width: '35%',
    height: 40,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  container: {
    backgroundColor: '#ffffff',
    width: getWidth,
    height: getHeight,
  },

  tieudelon: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  dropdown: {
    flex: 1,
    marginLeft: 16,
    marginTop: 10,
    height: 30,
    borderColor: 'black',
    borderWidth: 0.8,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  TitleTable: {
    backgroundColor: '#2e6b8b',
    justifyContent: 'center',
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CellTableFirst: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9ff',
    marginLeft: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  tieudebuoc: {
    backgroundColor: '#2e6b8b',

    height: 40,
    marginTop: 10,
    marginLeft: 40,
    width: '70%',
    borderRadius: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  ViewNgang: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 10,
    marginRight: 5,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texttieudebuoc: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  tieudebuoc1: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    height: 40,
    marginTop: 10,
    marginLeft: 40,
    width: '70%',
    borderRadius: 40,
    justifyContent: 'center',
    marginBottom: 10,
    borderColor: '#2e6b8b',
  },
  texttieudebuoc1: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 17,
    color: '#2e6b8b',
  },
  noidungtungbuoc: {
    height: 550,
    borderWidth: 1,
    marginLeft: 40,
    marginRight: 20,
    borderRadius: 20,
  },
  textTieuDe: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
  },
  TextNormal: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  TextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdown1: {
    width: '100%',

    height: 20,
    borderColor: 'gray',
    borderWidth: 0.8,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
