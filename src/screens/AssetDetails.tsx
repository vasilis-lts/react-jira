import Screen from '../components/Screen'
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, Fade, LinearProgress, Typography } from '@mui/material';
import { ReactComponent as BackIcon } from '../assets/images/back.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { download, getAssetById, getAssetRequestsByAssetIdAndDate } from '../components/AssetController';
import { AssetRequestsCustomField, AssetsCustomField } from '../helpers/constants';
import logo from '../assets/images/logo-placeholder2.jpg';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'

const HeaderWithBackButton = styled('div')(({ theme }) => ({
  height: "55px",
  width: "100%",
  display: "flex",
  paddingLeft: 10,
  paddingRight: 10,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#bbdefb",
  position: "relative",

  '& .back-btn': {
    position: 'absolute',
    left: 10,
    top: 10
  }
}));

function AssetDetails() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [IsOperational, setIsOperational] = useState<boolean>(false);
  const [IsClosed, setIsClosed] = useState<boolean>(false);
  const [IsDeclined, setIsDeclined] = useState<boolean>(false);
  const [CurrentTenant, setCurrentTenant] = useState<string>("");
  const [RevenuePerSecond, setRevenuePerSecond] = useState<number>(0);
  const [SelectedRevenuePeriodFilter, setSelectedRevenuePeriodFilter] = useState<string>("Today");
  const [SecondsOperational, setSecondsOperational] = useState<number>(0);

  const assetQuery = useQuery(['asset', id], () => getAssetById(id), { staleTime: 2000, })
  const assetRequestsQuery = useQuery(
    ['assetRequestsByAssetIdAndDate', id, SelectedRevenuePeriodFilter],
    () => getAssetRequestsByAssetIdAndDate(id, SelectedRevenuePeriodFilter),
    { staleTime: 500, })

  const downloadQuery = useQuery(['download', id, assetQuery.isSuccess], () => download(assetQuery.data), { staleTime: 2000, retry: false })

  useEffect(() => {
    if (assetRequestsQuery.isSuccess) {

      let isOperational;
      let currentTenant;
      let operationalSeconds = 0;

      if (assetRequestsQuery.data.issues.length) {
        assetRequestsQuery.data.issues.forEach(ar => {
          const startDate = ar.fields[AssetRequestsCustomField.StartDate];
          const endDate = ar.fields[AssetRequestsCustomField.EndDate];

          if (startDate && endDate) {
            const currentTime = dayjs().unix();
            const startDateTimeStamp = dayjs(startDate).unix();
            const endDateTimeStamp = dayjs(endDate).unix();

            if (dayjs().unix() < endDateTimeStamp) {
              isOperational = true;
              currentTenant = ar.fields[AssetRequestsCustomField.TenantName];
            }

            let startRevenueTimeStamp;

            switch (SelectedRevenuePeriodFilter) {
              case "Today":
                startRevenueTimeStamp = dayjs().startOf('day').unix();
                break;
              case "Week":
                startRevenueTimeStamp = dayjs().startOf('week').unix();
                break;
              case "Month":
                startRevenueTimeStamp = dayjs().startOf('month').unix();
                break;
              case "Year":
                startRevenueTimeStamp = dayjs().startOf('year').unix();
                break;
              case "All":
                startRevenueTimeStamp = dayjs('1970-01-01').unix();
                break;
              default:
                break;
            }

            // pick start of revenue filter
            // for asset requests that the start date is earlier than the revenue filter
            const operationalStartTimeStamp = startDateTimeStamp <= startRevenueTimeStamp ? startRevenueTimeStamp : startDateTimeStamp;

            // pick current time as end time 
            // for asset requests that are still operating 
            const operationalEndTimeStamp = endDateTimeStamp >= currentTime ? currentTime : endDateTimeStamp;

            // calc time diff in seconds
            operationalSeconds += (operationalEndTimeStamp - operationalStartTimeStamp);
          }

          setIsClosed(ar.fields.status?.name === 'Closed');
          setIsDeclined(ar.fields.resolution?.name === 'Declined');
        });
      }

      // amount of seconds of all assets requests
      // in the selected period 
      setSecondsOperational(operationalSeconds);

      setIsOperational(isOperational);
      setCurrentTenant(currentTenant);
    }
  }, [assetRequestsQuery.isSuccess, assetRequestsQuery.data, SelectedRevenuePeriodFilter]);

  useEffect(() => {
    if (assetQuery.isSuccess) {
      if (assetQuery.data.fields) {
        let revenuePerSecondNum = assetQuery.data.fields[AssetsCustomField.HourlyPrice] / 3600;
        setRevenuePerSecond(revenuePerSecondNum);
      }
    }
  }, [assetQuery.isSuccess, assetQuery.data]);

  return (
    <Screen id='AssetDetails'>
      <HeaderWithBackButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          Asset
        </Typography>

        <Button
          className='back-btn'
          variant='text'
          onClick={() => navigate("/")}>
          <BackIcon color="#444" style={{ width: 25, height: 25 }} />
        </Button>

      </HeaderWithBackButton>

      {assetQuery.isSuccess ?
        <Box className="asset-details flex-col" sx={{ p: 1, alignItems: 'center', mt: 2 }}>
          <Typography variant='h4' sx={{ mb: 1, mt: 1 }}>{assetQuery.data.fields[AssetsCustomField.Name]}</Typography>
          <Typography variant='h6' sx={{ mb: 1 }}>{assetQuery.data.fields[AssetsCustomField.Location]}</Typography>
          <div className="asset-img">

            {downloadQuery.isLoading ? <Box sx={{ height: 100 }}></Box> : downloadQuery.isSuccess ?
              <img src={downloadQuery.data} style={{ height: 100 }} alt="logo" /> :
              <img src={logo} style={{ height: 100 }} alt="logo" />}

          </div>
        </Box>
        : null}

      {assetQuery.isSuccess ?
        <Box className="asset-request-details flex-col" sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Typography variant='subtitle1'><b>Working status:</b> {IsOperational && !IsClosed && !IsDeclined ? 'Operational' : 'Non-operational'}</Typography>
          {IsOperational && !IsClosed && !IsDeclined ? <Box sx={{ width: '100%', mt: 2, mb: 2 }}><LinearProgress color="success" /></Box> : null}
          <Typography variant='subtitle1'><b>Tenant Name:</b> {IsOperational && !IsClosed && !IsDeclined ? CurrentTenant : '-'}</Typography>
          <Typography variant='subtitle1'><b>Real Time income:</b> {IsOperational && !IsClosed && !IsDeclined ? (RevenuePerSecond).toFixed(4) : '0'}&nbsp;€/sec</Typography>
        </Box>
        : null}

      {assetQuery.isError ? <Box sx={{ m: 2 }}>Asset data not available</Box> : null}

      <Fade in={assetQuery.isSuccess}>

        <Box className="asset-request-revenue-filter flex-col" sx={{ paddingLeft: 1, paddingRight: 1, pt: 3 }}>
          <ButtonGroup variant="contained" disableElevation aria-label="outlined primary button group" sx={{ marginTop: 1 }}>
            <Button onClick={() => setSelectedRevenuePeriodFilter('Today')} color={SelectedRevenuePeriodFilter === 'Today' ? "primary" : "inherit"}>Today</Button>
            <Button onClick={() => setSelectedRevenuePeriodFilter('Week')} color={SelectedRevenuePeriodFilter === 'Week' ? "primary" : "inherit"}>Week</Button>
            <Button onClick={() => setSelectedRevenuePeriodFilter('Month')} color={SelectedRevenuePeriodFilter === 'Month' ? "primary" : "inherit"}>Month</Button>
            <Button onClick={() => setSelectedRevenuePeriodFilter('Year')} color={SelectedRevenuePeriodFilter === 'Year' ? "primary" : "inherit"}>Year</Button>
            <Button onClick={() => setSelectedRevenuePeriodFilter('All')} color={SelectedRevenuePeriodFilter === 'All' ? "primary" : "inherit"}>All</Button>
          </ButtonGroup>

          {RevenuePerSecond && !IsClosed && !IsDeclined ?
            <Box id='revenueValue' sx={{ paddingLeft: 1, paddingRight: 1, mt: 3 }}>
              <Typography variant='h6'><b>Revenue:</b> {SecondsOperational ? (RevenuePerSecond * SecondsOperational).toFixed(2) : '0'}€</Typography>
            </Box> : null}
        </Box>
      </Fade>
    </Screen>
  )
}

export default AssetDetails