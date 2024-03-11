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
//import DatePicker from 'react-native-date-picker';
import {DataTable, TextInput} from 'react-native-paper';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import {token} from '../../../../DangNhap/dangNhap';
//import {RadioGroup} from 'react-native-radio-buttons-group';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const Chitiethosoxuly = () => {
  [open, setopen] = useState(false);
  [ngaysinh, setngaysinh] = useState(new Date());
  const [tendot, setTenDot] = useState([]);
  const [valueDotThi, setValueDotThi] = useState('');
  const [isFocusDotThi, setIsFocusDotThi] = useState(false);
  const [dotThi, setDotThi] = useState('');
  const [tabledata, setTableData] = useState([]);
  var getAPI1 = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_R_Para_File?MC_TTHC_GV_GuiYeuCau_ID=4`;
  const getDataHoSo = async () => {
    try {
      const response = await axios.get(getAPI1, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setTableData(response.data.body[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const [tabledata2, setTableData2] = useState([]);
  var getAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_ThanhPhanHoSoTiepNhan/GuiYeuCau_Load_ByIDGuiYeuCau?MC_TTHC_GV_GuiYeuCau_ID=4`;
  const getDataTabble = async () => {
    try {
      const response = await axios.get(getAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTableData2(response.data.body);
    } catch (error) {
      console.error(error);
    }
  };
  var getAPI2 = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_Load_ByIDGoc?MC_TTHC_GV_IDTTHC=4`;
  const [dataquytrinh, setquytrinh] = useState([]);

  const getDataQuyTrinh = async () => {
    try {
      const response = await axios.get(getAPI2, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setquytrinh(response.data.body);
      console.log(response.data.body);
    } catch (error) {
      console.error(error);
    }
  };
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
    {label: 'Phê duyệt', value: '1'},
    {label: 'Không phê duyệt', value: '2'},
    {label: 'Trình duyệt', value: ''},
  ];
  const handleSelectOption = option => {
    setSelectedOption(option.value);
  };
  useEffect(() => {
    getDataQuyTrinh();
    getDataHoSo();
    getDataTabble();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="CHI TIẾT HỒ SƠ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.tieudelon}>
          <Image
            source={require('../../../../../images/minus.png')}
            style={{width: 20, height: 20}}
          />
          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Thông tin người nộp hồ sơ
          </Text>
        </View>
        <View style={styles.ViewNgang}>
          <View style={{width: '25%'}}>
            <Text style={styles.TextBold}>Mã nhân sự: </Text>
          </View>
          <View style={{width: '80%'}}>
            <Text
              style={[styles.TextNormal, {textAlign: 'left', marginLeft: 40}]}>
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
              style={[styles.TextNormal, {textAlign: 'left', marginLeft: 40}]}>
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
              style={[styles.TextNormal, {textAlign: 'left', marginLeft: 40}]}>
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
              style={[styles.TextNormal, {textAlign: 'left', marginLeft: 40}]}>
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
              style={[styles.TextNormal, {textAlign: 'left', marginLeft: 40}]}>
              {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa}
            </Text>
          </View>
        </View>
        <View style={styles.tieudelon}>
          <Image
            source={require('../../../../../images/minus.png')}
            style={{width: 20, height: 20}}
          />
          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Thông tin hồ sơ
          </Text>
        </View>
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
            </DataTable>
          </ScrollView>
        </View>
        <View style={styles.tieudelon}>
          <Image
            source={require('../../../../../images/minus.png')}
            style={{width: 20, height: 20}}
          />
          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Quy trình xử lý
          </Text>
        </View>

        {tabledata.MC_TTHC_GV_IDMucDo === 2 ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../../../images/check-mark.png')}
                style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
              />
              <View style={[styles.tieudebuoc]}>
                <Text style={styles.texttieudebuoc}>
                  Bước {dataquytrinh[0].MC_TTHC_GV_TrangThai_STT}:{' '}
                  {dataquytrinh[0].MC_TTHC_GV_TrangThai_TenTrangThai}
                </Text>
              </View>
            </View>
            <View style={styles.noidungtungbuoc}>
              <Text
                style={[styles.TextBold, {marginTop: 10, textAlign: 'center'}]}>
                Thông báo(Gửi Email)
              </Text>

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
                  styles.TextNormal,
                  {textAlign: 'left', marginLeft: 30, marginTop: 1},
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
                    style={[styles.touchableOpacity, {backgroundColor: 'red'}]}
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
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../../../images/check-mark.png')}
                style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
              />
              <View style={[styles.tieudebuoc]}>
                <Text style={styles.texttieudebuoc}>
                  Bước {dataquytrinh[1].MC_TTHC_GV_TrangThai_STT}:{' '}
                  {dataquytrinh[1].MC_TTHC_GV_TrangThai_TenTrangThai}
                </Text>
              </View>
            </View>
            <View style={styles.noidungtungbuoc}>
              <Text
                style={[styles.TextBold, {marginTop: 10, textAlign: 'center'}]}>
                Thông báo(Gửi Email)
              </Text>
              <View style={{height: 100}}>
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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
                  ]}>
                  (Kích thước tối đa 5 MB)
                </Text>
                <View
                  style={[
                    styles.viewFooter,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 50,
                    },
                  ]}>
                  <View
                    style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                    <TouchableOpacity
                      style={styles.touchableOpacity}
                      onPress={() => {
                        if (dataTable.length != 0) {
                          ClearData();
                        } else {
                          handleModalPress();
                        }
                      }}>
                      <Text style={{color: 'white', fontSize: 18}}>
                        Tiếp nhận
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../../../../images/check-mark.png')}
                style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
              />
              <View style={[styles.tieudebuoc]}>
                <Text style={styles.texttieudebuoc}>
                  Bước {dataquytrinh[2].MC_TTHC_GV_TrangThai_STT}:{' '}
                  {dataquytrinh[2].MC_TTHC_GV_TrangThai_TenTrangThai}
                </Text>
              </View>
            </View>
            <View style={[styles.noidungtungbuoc, {marginBottom: 50}]}>
              <Text
                style={[styles.TextBold, {marginTop: 10, textAlign: 'center'}]}>
                Thông báo(Gửi Email)
              </Text>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  height: 60,
                  flexDirection: 'row',
                }}>
                <View style={{width: '50%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 15},
                    ]}>
                    Ngày giờ nộp
                  </Text>
                  <TextInput
                    style={{
                      width: '70%',
                      backgroundColor: '#ffffff',
                      height: 30,
                      borderWidth: 1,
                      borderRadius: 5,
                      marginLeft: 15,
                    }}
                  />
                </View>
                <View style={{width: '50%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 15},
                    ]}>
                    Địa điểm nộp
                  </Text>
                  <View style={{width: '90%', height: 43, marginTop: -10}}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocusDotThi && {borderColor: 'black'},
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      data={tendot.map((item, index) => ({
                        labelDotThi: item,
                        valueDotThi: index.toString(),
                      }))}
                      maxHeight={300}
                      labelField="labelDotThi"
                      valueField="valueDotThi"
                      placeholder={!isFocusDotThi ? 'Chọn đợt thi' : '...'}
                      value={valueDotThi}
                      onFocus={() => setIsFocusDotThi(true)}
                      onBlur={() => setIsFocusDotThi(false)}
                      onChange={item => {
                        setValueDotThi(item.valueDotThi);
                        setDotThi(item.labelDotThi);
                        setIsFocusDotThi(false);
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={{height: 100}}>
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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
                  ]}>
                  (Kích thước tối đa 5 MB)
                </Text>
                <View
                  style={[
                    styles.viewFooter,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 50,
                    },
                  ]}>
                  <View
                    style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                    <TouchableOpacity
                      style={styles.touchableOpacity}
                      onPress={() => {
                        if (dataTable.length != 0) {
                          ClearData();
                        } else {
                          handleModalPress();
                        }
                      }}>
                      <Text style={{color: 'white', fontSize: 18}}>
                        Tiếp nhận
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {tabledata.MC_TTHC_GV_IDMucDo === 3 ? (
          dataquytrinh.length === 3 ? (
            <View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[0].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[0].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>

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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
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
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[1].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[1].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[2].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[2].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={[styles.noidungtungbuoc, {marginBottom: 50}]}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    height: 60,
                    flexDirection: 'row',
                  }}>
                  <View style={{width: '50%'}}>
                    <Text
                      style={[
                        styles.TextNormal,
                        {textAlign: 'left', marginLeft: 15},
                      ]}>
                      Ngày giờ nộp
                    </Text>
                    <TextInput
                      style={{
                        width: '70%',
                        backgroundColor: '#ffffff',
                        height: 30,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginLeft: 15,
                      }}
                    />
                  </View>
                  <View style={{width: '50%'}}>
                    <Text
                      style={[
                        styles.TextNormal,
                        {textAlign: 'left', marginLeft: 15},
                      ]}>
                      Địa điểm nộp
                    </Text>
                    <View style={{width: '90%', height: 43, marginTop: -10}}>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocusDotThi && {borderColor: 'black'},
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={tendot.map((item, index) => ({
                          labelDotThi: item,
                          valueDotThi: index.toString(),
                        }))}
                        maxHeight={300}
                        labelField="labelDotThi"
                        valueField="valueDotThi"
                        placeholder={!isFocusDotThi ? 'Chọn đợt thi' : '...'}
                        value={valueDotThi}
                        onFocus={() => setIsFocusDotThi(true)}
                        onBlur={() => setIsFocusDotThi(false)}
                        onChange={item => {
                          setValueDotThi(item.valueDotThi);
                          setDotThi(item.labelDotThi);
                          setIsFocusDotThi(false);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : dataquytrinh.length === 4 ? (
            <View></View>
          ) : dataquytrinh.length === 5 ? (
            <View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[0].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[0].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>

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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
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
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[1].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[1].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[2].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[2].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <View style={{height: 100}}>
                  <RadioGroup
                    radioButtons={options}
                    onPress={handleSelectOption}
                    flexDirection="row"
                    layout="column"
                  />
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[3].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[3].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[4].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[4].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={[styles.noidungtungbuoc, {marginBottom: 50}]}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    height: 60,
                    flexDirection: 'row',
                  }}>
                  <View style={{width: '50%'}}>
                    <Text
                      style={[
                        styles.TextNormal,
                        {textAlign: 'left', marginLeft: 15},
                      ]}>
                      Ngày giờ nộp
                    </Text>
                    <TextInput
                      style={{
                        width: '70%',
                        backgroundColor: '#ffffff',
                        height: 30,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginLeft: 15,
                      }}
                    />
                  </View>
                  <View style={{width: '50%'}}>
                    <Text
                      style={[
                        styles.TextNormal,
                        {textAlign: 'left', marginLeft: 15},
                      ]}>
                      Địa điểm nộp
                    </Text>
                    <View style={{width: '90%', height: 43, marginTop: -10}}>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocusDotThi && {borderColor: 'black'},
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={tendot.map((item, index) => ({
                          labelDotThi: item,
                          valueDotThi: index.toString(),
                        }))}
                        maxHeight={300}
                        labelField="labelDotThi"
                        valueField="valueDotThi"
                        placeholder={!isFocusDotThi ? 'Chọn đợt thi' : '...'}
                        value={valueDotThi}
                        onFocus={() => setIsFocusDotThi(true)}
                        onBlur={() => setIsFocusDotThi(false)}
                        onChange={item => {
                          setValueDotThi(item.valueDotThi);
                          setDotThi(item.labelDotThi);
                          setIsFocusDotThi(false);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null
        ) : null}

        {tabledata.MC_TTHC_GV_IDMucDo === 4 ? (
          dataquytrinh.length === 3 ? (
            <View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[0].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[0].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>

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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
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
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[1].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[1].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[2].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[2].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={[styles.noidungtungbuoc, {marginBottom: 50}]}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : dataquytrinh.length === 4 ? (
            <View></View>
          ) : dataquytrinh.length === 5 ? (
            <View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[0].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[0].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>

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
                    styles.TextNormal,
                    {textAlign: 'left', marginLeft: 30, marginTop: 1},
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
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[1].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[1].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[2].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[2].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <View style={{height: 100}}>
                  <RadioGroup
                    radioButtons={options}
                    onPress={handleSelectOption}
                    flexDirection="row"
                    layout="column"
                  />
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[3].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[4].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={styles.noidungtungbuoc}>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../../../../images/check-mark.png')}
                  style={{width: 40, height: 40, marginLeft: 10, marginTop: 10}}
                />
                <View style={[styles.tieudebuoc]}>
                  <Text style={styles.texttieudebuoc}>
                    Bước {dataquytrinh[4].MC_TTHC_GV_TrangThai_STT}:{' '}
                    {dataquytrinh[4].MC_TTHC_GV_TrangThai_TenTrangThai}
                  </Text>
                </View>
              </View>
              <View style={[styles.noidungtungbuoc, {marginBottom: 50}]}>
                <Text
                  style={[
                    styles.TextBold,
                    {marginTop: 10, textAlign: 'center'},
                  ]}>
                  Thông báo(Gửi Email)
                </Text>
                <View style={{height: 100}}>
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
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 30, marginTop: 1},
                    ]}>
                    (Kích thước tối đa 5 MB)
                  </Text>
                  <View
                    style={[
                      styles.viewFooter,
                      {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                      },
                    ]}>
                    <View
                      style={[styles.buttonHuy, {backgroundColor: '#245d7c'}]}>
                      <TouchableOpacity
                        style={styles.touchableOpacity}
                        onPress={() => {
                          if (dataTable.length != 0) {
                            ClearData();
                          } else {
                            handleModalPress();
                          }
                        }}>
                        <Text style={{color: 'white', fontSize: 18}}>
                          Tiếp nhận
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Chitiethosoxuly;
const styles = StyleSheet.create({
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
  texttieudebuoc: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  noidungtungbuoc: {
    height: 500,
    borderWidth: 1,
    marginLeft: 50,
    marginRight: 10,
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
});
