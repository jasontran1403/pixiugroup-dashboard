import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import Swal from 'sweetalert2';
import { alpha, useTheme } from '@mui/material/styles';
import { DateRange } from "react-date-range";

// @mui
import { Grid, Container, Typography, MenuItem, Popover, Card, CardHeader, Box, TextField, Button } from '@mui/material';

// components
import ReactApexChart from 'react-apexcharts';
import { DateRangeComponents } from '../components/datepicker';
import { fCurrency, fNumber, fShortenNumber } from '../utils/formatNumber';
import Iconify from '../components/iconify';
// components
import { useChart } from '../components/chart';
import { prod, dev } from "../utils/env";



// sections
import {
  AppNewsUpdate,
  AppNewsUpdate2,
  AppWidgetSummary,
  AppWidgetSummaryUSD,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const handleInitMonth = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const numberOfMonths = 3; // Số tháng bạn muốn tạo

  const recentMonths = [];

  let month = currentMonth;
  let year = currentYear;

  while (recentMonths.length < numberOfMonths) {
    // Định dạng tháng và năm thành chuỗi "MM/YYYY"
    const formattedMonth = `${String(month).padStart(2, '0')}/${year}`;
    recentMonths.push(formattedMonth);

    // Cập nhật tháng và năm cho tháng tiếp theo
    if (month === 1) {
      month = 12;
      year -= 1;
    } else {
      month -= 1;
    }
  }

  return recentMonths;
}

const convertToDate = (timeunix) => {
  // Tạo một đối tượng Date từ Unix timestamp
  const date = new Date(timeunix * 1000); // *1000 để chuyển đổi từ giây sang mili giây

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1

  // Tạo chuỗi định dạng "dd/MM"
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
};
export default function DashboardAppPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [balances, setBalances] = useState([]);
  const [balance, setBalance] = useState(0.00);
  const [commission, setCommission] = useState(0.00);
  const [isLoading, setIsLoading] = useState(false);
  const [listMenu] = useState(handleInitMonth());
  const [currentMonth, setCurrentMonth] = useState(listMenu[0]);
  const [listExness, setListExness] = useState([]);
  const [currentExness, setCurrentExness] = useState("");
  const [label, setLabel] = useState([]);
  const [commissionLabel, setCommissionLabel] = useState([]);
  const [profits, setProfits] = useState();
  const [commissions, setCommissions] = useState([]);
  const [listTransaction, setListTransaction] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(localStorage.getItem("email") ? localStorage.getItem("email") : "");
  const [currentAccessToken] = useState(localStorage.getItem("access_token") ? localStorage.getItem("access_token") : "");
  const [refCode, setRefCode] = useState("");
  const [listTransaction2, setListTransaction2] = useState([]);
  const [prevBalance, setPrevBalance] = useState([]);
  const [prevProfit, setPrevProfit] = useState(0.0);
  const [prevDeposit, setPrevDeposit] = useState(0.0);
  const [prevWithdraw, setPrevWithdraw] = useState(0.0);
  const [isAdmin] = useState(localStorage.getItem("r") === "a");
  const [isManager] = useState(localStorage.getItem("r") === "m");
  const [isUser] = useState(localStorage.getItem("r") === "u");
  const [totalCommissions, setTotalCommissions] = useState(0.0);
  const [min, setMin] = useState(0.0);
  const [max, setMax] = useState(0.0);
  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(null);
  const [listTable] = useState([{ table: "Profits" }, { table: "Commissions" }])
  const [currentTable, setCurrentTable] = useState(listTable[0].table);
  const [listExnessFiltered, setListExnessFiltered ] = useState([])
  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    if (isAdmin && currentEmail !== "root@gmail.com") {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${prod}/api/v1/secured/get-total-commission/${currentEmail}`,
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`
        }
      };

      axios.request(config)
        .then((response) => {
          setTotalCommissions(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleOpen2 = (event) => {
    setOpen2(event.currentTarget);
  };

  const handleClose2 = () => {
    setOpen2(null);
  };

  const handleOpen3 = (event) => {
    setOpen3(event.currentTarget);
  };

  const handleClose3 = () => {
    setOpen3(null);
  };

  const handleChangeTable = (e) => {
    setCurrentTable(e);
    handleClose3();
  };

  const handleChangeMonth = (month) => {
    if (currentExness === "") {
      handleClose();
      return;
    }
    if (currentExness === "Chọn Exness ID") {
      // setCurrentMonth(month);
      // fetchData(currentEmail, month);
    } else {
      setCurrentMonth(month);
      fetchData(currentExness, month);
    }


    handleClose();
  }

  const handleChangeExness = (exness) => {
    if (exness === "Chọn Exness ID") {
      // setCurrentExness(exness);
      // fetchData(currentEmail, currentMonth);
      // fetchPrev(currentEmail);
    } else {
      setCurrentExness(exness);
      fetchData(exness, currentMonth);
      fetchPrev(exness);
    }

    handleClose2();
  }

  useEffect(() => {
    setIsLoading(true);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/get-exness/${encodeURI(localStorage.getItem("r") === "a" ? "all" : localStorage.getItem("r") === "m" ? `m-${currentEmail}` : currentEmail)}`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios(config)
      .then((response) => {
        if (response.data.length > 0) {
          const updatedList = ["Chọn Exness ID"].concat(response.data);
          setListExness(updatedList);

          setCurrentExness("Chọn Exness ID");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          Swal.fire({
            title: "An error occured",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: "Session is ended, please login again !",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          }).then(() => {
            localStorage.clear();
            navigate('/login', { replace: true });
          });
        }
      });

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return (() => {
      clearTimeout(timeout);
    })
  }, []);

  useEffect(() => {
    let urlConvert = "";
    if (isAdmin) {
      urlConvert = `${prod}/api/v1/secured/get-transaction/email=${"all"}`
    } else {
      urlConvert = `${prod}/api/v1/secured/get-transaction/email=${currentEmail}`
    }
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: urlConvert,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios.request(config)
      .then((response) => {
        const firstFiveItems = response.data.slice(0, 5);
        setListTransaction(firstFiveItems);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          Swal.fire({
            title: "An error occured",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: "Session is ended, please login again !",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          }).then(() => {
            localStorage.clear();
            navigate('/login', { replace: true });
          });
        }
      });

  }, []);

  useEffect(() => {
    fetchPrev(currentEmail);
  }, []);

  const fetchPrev = (exness) => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/get-prev-data/${exness}`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };

    axios.request(config)
      .then((response) => {
        setPrevBalance(response.data.balance / 100);
        setPrevProfit(response.data.profit / 100);
        setPrevDeposit(response.data.deposit / 100);
        setPrevWithdraw(response.data.withdraw / 100);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          Swal.fire({
            title: "An error occured",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: "Session is ended, please login again !",
            icon: "error",
            timer: 3000,
            position: 'center',
            showConfirmButton: false
          }).then(() => {
            localStorage.clear();
            navigate('/login', { replace: true });
          });
        }
      });

  }

  const timPhanTuLonNhat = (arr) => {
    if (arr.length === 0) {
      return null; // Trường hợp mảng rỗng
    }
    return arr.reduce((max, current) => (current.amount > max.amount ? current : max), arr[0]);
  }

  const timPhanTuNhoNhat = (arr) => {
    if (arr.length === 0) {
      return null; // Trường hợp mảng rỗng
    }
    return arr.reduce((min, current) => (current.amount < min.amount ? current : min), arr[0]);
  }

  const fetchData = (exness, time) => {
    const [month, year] = time.split('/');

    // Tạo ngày đầu tiên của tháng và tháng sau
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    let nextMonth = parseInt(month, 10) + 1;

    if (nextMonth > 12) {
      nextMonth = 1;
    }

    const nextYear = nextMonth > 12 ? parseInt(year, 10) + 1 : year;

    const endDate = new Date(`${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00Z`);

    // Chuyển đổi thành timestamps Unix
    const startUnix = startDate.getTime() / 1000;
    const endUnix = endDate.getTime() / 1000;

    const encodedFrom = encodeURIComponent(startUnix);
    const encodedTo = encodeURIComponent(endUnix);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/get-info-by-exness/exness=${exness}&from=${encodedFrom}&to=${encodedTo}`,
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`
      }
    };


    axios(config)
      .then((response) => {
        setBalance(response.data.profit / 100);
        setCommission(response.data.commission);

        const dataProfits = response.data.profits.map((profit) => profit);

        // Tạo một đối tượng để lưu trữ tổng số lượng dựa trên thời gian
        const timeMap = {};

        // Lặp qua mảng dữ liệu và tính tổng số lượng dựa trên thời gian
        dataProfits.forEach(item => {
          const { time, amount } = item;
          if (timeMap[time] === undefined) {
            timeMap[time] = 0;
          }
          timeMap[time] += amount / 100;
        });


        // Chuyển đổi đối tượng thành một mảng kết quả
        const result = Object.keys(timeMap).map(time => ({
          time: parseInt(time, 10),
          amount: timeMap[time]
        }));

        setLabel(result.map((profit) => convertToDate(profit.time)));
        setProfits(result.map((profit) => profit.amount));

        const dataBalances = response.data.balances.map((balance) => balance);

        // Tạo một đối tượng để lưu trữ tổng số lượng dựa trên thời gian
        const timeMapBalances = {};

        // Lặp qua mảng dữ liệu và tính tổng số lượng dựa trên thời gian
        dataBalances.forEach(item => {
          const { time, amount } = item;
          if (timeMapBalances[time] === undefined) {
            timeMapBalances[time] = 0;
          }
          timeMapBalances[time] += amount / 100;
        });


        // Chuyển đổi đối tượng thành một mảng kết quả
        const resultBalances = Object.keys(timeMapBalances).map(time => ({
          time: parseInt(time, 10),
          amount: timeMapBalances[time]
        }));

        setMax(timPhanTuLonNhat(resultBalances).amount);
        setMin(timPhanTuNhoNhat(resultBalances).amount);
        setBalances(resultBalances.map((profit) => profit.amount));

        // 
        const dataHistories = response.data.commissions.map((history) => history);

        // Tạo một đối tượng để lưu trữ tổng số lượng dựa trên thời gian
        const timeMapHistories = {};

        // Lặp qua mảng dữ liệu và tính tổng số lượng dựa trên thời gian
        dataHistories.forEach(item => {
          const { time, amount } = item;
          if (timeMapHistories[time] === undefined) {
            timeMapHistories[time] = 0;
          }
          timeMapHistories[time] += amount;
        });


        // Chuyển đổi đối tượng thành một mảng kết quả
        const resultHistories = Object.keys(timeMapHistories).map(time => ({
          time: parseInt(time, 10),
          amount: timeMapHistories[time]

        }));

        setCommissionLabel(resultHistories.map((history) => convertToDate(history.time)));
        setCommissions(resultHistories.map((history) => history.amount));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const chartData = [
    {
      name: 'Profit',
      type: 'bar',
      data: profits,
      yAxis: 0,
    },
    {
      name: 'Balance',
      type: 'line',
      data: balances,
      yAxis: 1,
    },
  ];

  const chartData2 = [
    {
      name: 'Commission',
      type: 'area',
      data: commissions,
      yAxis: 0,
    },
  ];

  const chartOptions = useChart({
    plotOptions: { line: { columnWidth: '16%' } },
    fill: {
      type: 'solid',
    },
    colors: ["#27cf5c", "#1d7fc4"],
    labels: label,
    xaxis: { type: 'text' },
    yaxis: [
      // Cấu hình cho trục y-axis bên trái
      {
        title: {
          text: 'Profits',
        },
        tickAmount: 5,
        labels: {
          "formatter": function (value) {
            if (typeof value === "undefined" || value === 5e-324) {
              return 0; // Hoặc giá trị mặc định khác tùy ý
            }
            return fShortenNumber(value);
          },
        },
      },
      // Cấu hình cho trục y-axis bên phải
      {
        opposite: true, // Điều này đảm bảo rằng trục y-axis nằm ở phía bên phải
        title: {
          text: 'Balances',
        },
        tickAmount: 5,
        max: max + max * 0.1,
        min: min - min * 0.1,
        labels: {
          "formatter": function (value) {
            if (typeof value === "undefined" || value === 5e-324) {
              return 0; // Hoặc giá trị mặc định khác tùy ý
            }
            return fShortenNumber(value);
          },
        },
      },
    ],

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return y === 0 ? '$0' : `$${fShortenNumber(y)}`;
          }
          return y;
        },
      },
    },
    stroke: {
      width: 2, // Điều chỉnh độ lớn của line ở đây (số lớn hơn = line to hơn)
    },
  });

  const chartOptions2 = useChart({
    plotOptions: { area: { columnWidth: '16%' } },
    fill: {
      type: 'gradient',
    },
    gradient: {
      shade: 'dark',
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 100],
      colorStops: []
    },
    colors: ["#ff3273"],
    labels: commissionLabel,
    xaxis: { type: 'text' },
    yaxis: [
      // Cấu hình cho trục y-axis bên trái
      {
        title: {
          text: 'Commissions',
        },
        labels: {
          "formatter": function (value) {
            return fShortenNumber(value); // Định dạng số nguyên
          },
        },
      },
      // Cấu hình cho trục y-axis bên phải
    ],

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return y === 0 ? '$0' : `$${fShortenNumber(y)}`;
          }
          return `$${y}`;
        },
      },
    },
    stroke: {
      width: 1, // Điều chỉnh độ lớn của line ở đây (số lớn hơn = line to hơn)
    },
  });

  const [startDay,setStartDay] = useState('')
  const [endDay, setEndDay] = useState('')

  const handleDatePicker = (item) => {
    // console.log(item[0].startDate)
    const formattedStartDate = new Date(item[0].startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    setStartDay(formattedStartDate);

    const formattedEndDate = new Date(item[0].endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    setEndDay(formattedEndDate)
  };

  



  const handleSearch = (keyword) => {
    const result = listExness.filter((item) => item.includes(keyword));
    setListExnessFiltered(result);
    setOpen2(!!keyword);
  }



  return (
    <>
      <Helmet>
        <title> Dashboard </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg' />
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>
        <Grid style={{marginBottom: "16px"}} item xs={12} sm={12} md={12} >
          <input id = "black-text" type="text"  onChange={(e) => handleSearch(e.target.value)} placeholder={"Nhap Exness can tim"}  className="button-30" /> 
          <span className='search-section'>
            <input disabled value={currentExness} type="text" className="search-input" /> 
          </span>
          
          <div
            id ='exness-searchbar' 
            open = {open2}
            style={{
              display: open2 ? 'block' : 'none',
              position: "absolute",
              minWidth: "240px",
              zIndex: 2,
              backgroundColor: "white",
              border: "1px solid #ccc",
              boxShadow: "2px 2px 2px #ccc",
            }}

          >
            {listExnessFiltered?.map((item, index) => {
              return <MenuItem key={index} onClick={() => { handleChangeExness(item) }}>
                <Iconify sx={{ mr: 2 }} />
                {item}
              </MenuItem>
            })}
          </div>
        </Grid>
        <Grid style={
          {display:'flex',
          flexDirection:'row',
          alignItems:'center'}
          }
          container spacing={3}
          >
          {isAdmin ? (
            <>
              <Grid 
              item xs={12} md={12} lg={6} >
                <Card style = {
                { borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.112)',
                  backdropFilter: 'blur(3px)',
                  height: 'max-content',
                  border: '1px solid #ccc',
                }
              } >
                    {/* <div className='day-section'>
                      <input style={{padding:"4px", fontWeight: "500",textAlign: "center"}} disabled value={startDay} />
                      <span> - </span>
                      <input style={{padding:"4px", fontWeight: "500",textAlign: "center"}} disabled value={endDay} />  
                    </div> */}

                    <div className='btn-wrap'>
                      <Button variant="text" className="button-30" onClick={handleOpen3}>{currentTable}</Button>
                      {/* <Button style={{marginLeft: "12px"}} className="button-30" onClick={() => {
                        setIsRender(!isRender)
                      }}>
                        Select Day
                      </Button> */}
                    </div>
                      <div className = 'calendar-wrapper' style={{position:'absolute', zIndex: '50'}}>
                        {isRender &&<DateRangeComponents handleDatePicker={handleDatePicker} /> }
                      </div>

                  <Popover
                    open={Boolean(open3)}
                    anchorEl={open3}
                    onClose={handleClose3}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        p: 1,
                        width: 240,
                        marginTop: "40px",
                        '& .MuiMenuItem-root': {
                          px: 1,
                          typography: 'body2',
                          borderRadius: 0.75,
                        },
                      },
                    }}
                  >
                    {listTable.map((item, index) => {
                      return <MenuItem key={index} onClick={() => { handleChangeTable(item.table) }}>
                        <Iconify sx={{ mr: 2 }} />
                        {item.table}
                      </MenuItem>
                    })}
                  </Popover>
                  <Box sx={{ p: 3, pb: 1 }} dir="ltr">

                    {currentTable === "Profits" ?
                      <ReactApexChart id="chart" type="line" series={chartData} options={chartOptions} height={364} />
                      :
                      <ReactApexChart id="chart" type="line" series={chartData2} options={chartOptions2} height={364} />
                    }
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummaryUSD classColor={"commission-background"} className="balance-section" sx={{ mb: 2 }} title="Total Commissions" total={commission} color="info" icon={'mi:layers'} />
                <AppWidgetSummaryUSD classColor={"deposit-background"} className="deposit-section" sx={{ mb: 2 }} title="Total Deposits" total={prevDeposit} color="info" icon={'mi:layers'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary className="total-commission commission-section" sx={{ mb: 2 }} title="Total Profilts" total={prevProfit} icon={'iconoir:coins-swap'} />
                <AppWidgetSummary className="withdraw-section" sx={{ mb: 2 }} title="Total Withdraws" total={prevWithdraw} icon={'iconoir:coins-swap'} />
              </Grid>
            </>) : isManager ? (<>
              <Grid item xs={12} md={12} lg={6} >
                <Card>
                  <Button variant="text" className="button-30" onClick={handleOpen3}>{currentTable}</Button>
                  <Popover
                    open={Boolean(open3)}
                    anchorEl={open3}
                    onClose={handleClose3}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{
                      sx: {
                        p: 1,
                        width: 240,
                        marginTop: "40px",
                        '& .MuiMenuItem-root': {
                          px: 1,
                          typography: 'body2',
                          borderRadius: 0.75,
                        },
                      },
                    }}
                  >
                    {listTable.map((item, index) => {
                      return <MenuItem key={index} onClick={() => { handleChangeTable(item.table) }}>
                        <Iconify sx={{ mr: 2 }} />
                        {item.table}
                      </MenuItem>
                    })}
                  </Popover>
                  <Box sx={{ p: 3, pb: 1 }} dir="ltr">

                    {currentTable === "Profits" ?
                      <ReactApexChart id="chart" type="line" series={chartData} options={chartOptions} height={364} />
                      :
                      <ReactApexChart id="chart" type="line" series={chartData2} options={chartOptions2} height={364} />
                    }
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummaryUSD classColor={"commission-background"} className="balance-section" sx={{ mb: 2 }} title="Balance" total={balance} color="info" icon={'mi:layers'} />
                <AppWidgetSummaryUSD classColor={"commission-background"} className="deposit-section" sx={{ mb: 2 }} title="Total Deposits" total={prevDeposit} color="info" icon={'mi:layers'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary className="total-commission commission-section" sx={{ mb: 2 }} title="Total Profilts" total={prevProfit} icon={'iconoir:coins-swap'} />
                <AppWidgetSummary className="withdraw-section" sx={{ mb: 2 }} title="Total Withdraws" total={prevWithdraw} icon={'iconoir:coins-swap'} />
              </Grid>
            </>) : (
            <>
              <Grid item xs={12} md={12} lg={6} >
                <Card>
                  <Button variant="text" className="button-30" id="button-30">{currentTable}</Button>

                  <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                    <ReactApexChart id="chart" type="line" series={chartData} options={chartOptions} height={364} />
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummaryUSD classColor={"commission-background"} className="balance-section" sx={{ mb: 2 }} title="Balance" total={balance} color="info" icon={'mi:layers'} />
                <AppWidgetSummaryUSD classColor={"commission-background"} className="deposit-section" sx={{ mb: 2 }} title="Total Deposits" total={prevDeposit} color="info" icon={'mi:layers'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary className="total-commission commission-section" sx={{ mb: 2 }} title="Total Profilts" total={prevProfit} icon={'iconoir:coins-swap'} />
                <AppWidgetSummary className="withdraw-section" sx={{ mb: 2 }} title="Total Withdraws" total={prevWithdraw} icon={'iconoir:coins-swap'} />
              </Grid>
            </>
          )}

          {isAdmin && <Grid item xs={12} md={12} lg={12}>
            <AppNewsUpdate2
             />
          </Grid>}

          <Grid item xs={12} md={12} lg={12}>
            <AppNewsUpdate
            style = {
            { borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.112)',
              backdropFilter: 'blur(3px)',
              height: 'max-content',
              border: '1px solid #ccc',
            }
              }

              title="Danh sách giao dịch"
              list={listTransaction}
            />
          </Grid>
        </Grid>
      </Container >
    </>
  );
}
