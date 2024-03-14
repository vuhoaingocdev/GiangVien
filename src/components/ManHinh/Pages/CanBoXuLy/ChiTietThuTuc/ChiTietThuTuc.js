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
} from 'react-native';
import HeaderBack from '../../../Untils/HeaderBack';
import {MangQuyen} from '../DanhSachThuTuc/CBXL_DanhSachThuTuc';
import DatePicker from 'react-native-date-picker';
import {Button, DataTable, TextInput} from 'react-native-paper';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {token} from '../../../../DangNhap/dangNhap';
import Index from '../..';
//import {RadioGroup} from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const Chitiethosoxuly = props => {
  const [tabledata, setTableData] = useState([]);
  const [YeuCauID, setYeuCauID] = useState(0);
  const [TrangThaiSTT, setTrangThaiSTT] = useState(0);
  const [idThuTuc, setidThuTuc] = useState(props.route.params.IDGuiYeuCau);
  const [MangBuocHienHanh, setMangBuocHienHanh] = useState({});
  var getAPI1 = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_R_Para_File`;
  const getDataHoSo = async IDthutuc => {
    try {
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
      setTrangThaiSTT(response.data.body[0].MC_TTHC_GV_TrangThai_STT + 1);
      setYeuCauID(response.data.body[0].MC_TTHC_GV_GuiYeuCau_YeuCau_ID);
    } catch (error) {
      console.error(error + 'Getdatahoso');
    }
  };
  const [tabledata2, setTableData2] = useState([]);
  var getAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_ThanhPhanHoSoTiepNhan/GuiYeuCau_Load_ByIDGuiYeuCau`;
  const getDataTabble = async IDthutuc => {
    try {
      const response = await axios.get(getAPI, {
        params: {MC_TTHC_GV_GuiYeuCau_ID: IDthutuc},
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error + 'Getdatahoso');
    }
  };

  const [dataquytrinh, setquytrinh] = useState([]);
  const getDataQuyTrinh = async () => {
    try {
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
    } catch (error) {
      console.error(error + 'Getdataquytrinh');
    }
  };

  const getTrangThaiHienHanh = async () => {
    try {
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
    } catch (error) {
      console.error(error + 'Getdatahoso');
    }
  };

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
    {label: 'Phê duyệt', value: '1'},
    {label: 'Không phê duyệt', value: '2'},
    {label: 'Trình duyệt', value: ''},
  ];

  useEffect(() => {
    if (!isSecondViewVisible) {
      setFirstViewHeight(20); // Reset height if second view is visible
    } else {
      setFirstViewHeight(550); // Set height to 50 when second view is invisible
    }
  });
  const [status, setstatus] = useState(true);
  const [status1, setstatus1] = useState(true);
  const [status2, setstatus2] = useState(true);
  const [isSecondViewVisible, setIsSecondViewVisible] = useState(true);
  const [firstViewHeight, setFirstViewHeight] = useState(550);
  const [open, setopen] = useState(false);
  const [ngaygui, setngaygui] = useState(new Date());
  const handlePress = () => {
    setopen(!open); // Chuyển đổi giá trị của 'open'
  };

  const dataLoaiThi = [
    {labelLoaiThi: 'Minh Khai', valueLoaiThi: '2'},
    {labelLoaiThi: 'Lĩnh Nam', valueLoaiThi: '1'},
  ];
  const [loaiThi, setLoaiThi] = useState('');
  const [valueLoaiThi, setValueLoaiThi] = useState('');
  const [isFocusLoaiThi, setIsFocusLoaiThi] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled1, setIsDisabled1] = useState(false);
  useEffect(() => {
    if (MangQuyen[0] === '16' || MangQuyen[0] === '24') {
      setIsDisabled(!isDisabled);
    }
    if (MangQuyen[0] === '16' || MangQuyen[0] === '25') {
      setIsDisabled1(!isDisabled1);
    }
    //if(MangQuyen[0]==='')
    console.log('Data quyen: ' + MangQuyen);
  }, []);
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
                  {/* <DataTable
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
                    <Text style={[styles.TextBold, {color: 'white'}]}>STT</Text>
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
                {tabledata2.map((td, index) => (
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
                ))}
              </DataTable> */}
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
              {isSecondViewVisible ? (
                <Image
                  source={require('../../../../../images/dry-clean.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
              )}

              {isSecondViewVisible ? (
                <View style={[styles.tieudebuoc1]}>
                  <Text style={styles.texttieudebuoc1}>
                    Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                    {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              ) : (
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                    {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              )}
            </View>

            {MangBuocHienHanh.MC_TTHC_GV_TrangThai_ID ===
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
                  'Tiếp nhận hồ sơ' ||
                MangBuocHienHanh.MC_TTHC_GV_TrangThai_TenTrangThai ===
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
                      }}>
                      <Button>
                        <Text>Chọn tệp</Text>
                      </Button>
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
                            getDataTabble();
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
                          <Text style={styles.modalText}>Không phê duyệt</Text>
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
                    />
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
                            getDataTabble();
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
                          <Text style={styles.modalText}>Không phê duyệt</Text>
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
                    />
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
                            getDataTabble();
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
                        <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                          Ngày giờ hẹn trả
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={handlePress}
                            style={{
                              flexDirection: 'row',
                              borderWidth: 1,
                              width: '60%',
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
                                backgroundColor: 'red',
                              }}
                              value={ngaygui
                                .toLocaleDateString('vi-VN')
                                .toString()}
                            />

                            <Image
                              source={require('../../../../../images/calendar.png')}
                              style={{width: 25, height: 25, marginTop: 2.5}}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{marginTop: 10, marginLeft: -10}}>
                        <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                          Địa điểm hẹn trả
                        </Text>
                        <Dropdown
                          style={[
                            styles.dropdown1,
                            isFocusLoaiThi && {borderColor: 'black'},
                          ]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          data={dataLoaiThi}
                          maxHeight={300}
                          labelField="labelLoaiThi"
                          valueField="valueLoaiThi"
                          placeholder={
                            !isFocusLoaiThi ? 'Chọn địa điểm' : '...'
                          }
                          value={valueLoaiThi}
                          onFocus={() => setIsFocusLoaiThi(true)}
                          onBlur={() => setIsFocusLoaiThi(false)}
                          onChange={item => {
                            setValueLoaiThi(item.valueLoaiThi);
                            setLoaiThi(item.labelLoaiThi);
                            setIsFocusLoaiThi(false);
                          }}
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
                    />
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
                            getDataTabble();
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
                ) : null}
              </View>
            ) : null}
          </View>
        ))}
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
    height: 500,
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
