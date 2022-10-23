import Screen from '../components/Screen'
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, LinearProgress, Typography } from '@mui/material';
import { ReactComponent as BackIcon } from '../assets/images/back.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssetById, getAssetRequestsByAssetIdAndDate } from '../components/AssetController';
import { AssetRequestsCustomField, AssetsCustomField } from '../helpers/constants';
import logo from '../assets/images/logo-placeholder2.jpg';
import { useEffect, useState } from 'react';

const HeaderWithBackButton = styled('div')(({ theme }) => ({
  height: "55px",
  width: "100%",
  display: "flex",
  paddingLeft: 10,
  paddingRight: 10,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#E0E0E0",
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
  const [CurrentTenant, setCurrentTenant] = useState<string>("");
  const [RevenuePerSecond, setRevenuePerSecond] = useState<number>(0);
  const [SelectedRevenuePeriodFilter, setSelectedRevenuePeriodFilter] = useState<string>("Today");
  const [SecondsOperational, setSecondsOperational] = useState<number>(0);

  const assetQuery = useQuery(['asset', id], () => getAssetById(id), { staleTime: 5000, })
  const assetRequestsQuery = useQuery(
    ['assetRequestsByAssetIdAndDate', id, SelectedRevenuePeriodFilter],
    () => getAssetRequestsByAssetIdAndDate(id, SelectedRevenuePeriodFilter),
    { staleTime: 500, })

  useEffect(() => {
    if (assetRequestsQuery.isSuccess) {

      const currentTime = new Date().getTime();
      let isOperational;
      let currentTenant;

      let operationalSeconds = 0;

      if (assetRequestsQuery.data.issues.length) {
        assetRequestsQuery.data.issues.forEach(ar => {
          const startDate = ar.fields[AssetRequestsCustomField.StartDate];
          const endDate = ar.fields[AssetRequestsCustomField.EndDate];

          if (startDate && endDate) {
            const startDateTimeStamp = new Date(startDate).getTime();
            const endDateTimeStamp = new Date(endDate).getTime();

            // pick current time as end time 
            // for asset requests that are still operating 
            const operationalEndTimeStamp = endDateTimeStamp > currentTime ? currentTime : endDateTimeStamp;

            operationalSeconds += (operationalEndTimeStamp - startDateTimeStamp) / 1000;

            if (startDateTimeStamp < currentTime && currentTime < endDateTimeStamp) {
              isOperational = true;
              currentTenant = ar.fields[AssetRequestsCustomField.TenantName];
            }
          }
        });
      }

      setSecondsOperational(operationalSeconds)
      setIsOperational(isOperational);
      setCurrentTenant(currentTenant);
    }
  }, [assetRequestsQuery.isSuccess, assetRequestsQuery.data]);

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
          onClick={() => navigate("/assets")}>
          <BackIcon color="#444" style={{ width: 25, height: 25 }} />
        </Button>

      </HeaderWithBackButton>


      {assetQuery.isSuccess ?
        <Box className="asset-details flex-col" sx={{ p: 1, alignItems: 'center', mt: 1 }}>
          <Typography variant='h6'>{assetQuery.data.fields[AssetsCustomField.Name]}</Typography>
          <Typography variant='h6'>{assetQuery.data.fields[AssetsCustomField.Location]}</Typography>
          <div className="asset-img">
            <img src={
              assetQuery.data.fields.logo ?
                assetQuery.data.fields :
                logo} style={{ width: 80 }} alt="logo" />
          </div>
        </Box>
        : null}

      {assetQuery.isSuccess ?
        <Box className="asset-request-details flex-col" sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Typography variant='subtitle1'><b>Working status:</b> {IsOperational ? 'Operational' : 'Non-operational'}</Typography>
          {IsOperational && <Box sx={{ width: '100%', mt: 2, mb: 2 }}><LinearProgress color="success" /></Box>}
          <Typography variant='subtitle1'><b>Tenant Name:</b> {IsOperational ? CurrentTenant : '-'}</Typography>
          <Typography variant='subtitle1'><b>Real Time income:</b> {IsOperational ? (RevenuePerSecond).toFixed(4) : '0'}&nbsp;€/sec</Typography>
        </Box>
        : null}

      {assetQuery.isError ? <Box sx={{ m: 2 }}>Asset data not available</Box> : null}

      <Box className="asset-request-revenuce-filter flex-col" sx={{ paddingLeft: 1, paddingRight: 1, mt: 3 }}>
        <ButtonGroup variant="contained" disableElevation aria-label="outlined primary button group" sx={{ marginTop: 1 }}>
          <Button onClick={() => setSelectedRevenuePeriodFilter('Today')} color={SelectedRevenuePeriodFilter === 'Today' ? "primary" : "inherit"}>Today</Button>
          <Button onClick={() => setSelectedRevenuePeriodFilter('Week')} color={SelectedRevenuePeriodFilter === 'Week' ? "primary" : "inherit"}>Week</Button>
          <Button onClick={() => setSelectedRevenuePeriodFilter('Month')} color={SelectedRevenuePeriodFilter === 'Month' ? "primary" : "inherit"}>Month</Button>
          <Button onClick={() => setSelectedRevenuePeriodFilter('Year')} color={SelectedRevenuePeriodFilter === 'Year' ? "primary" : "inherit"}>Year</Button>
          <Button onClick={() => setSelectedRevenuePeriodFilter('All')} color={SelectedRevenuePeriodFilter === 'All' ? "primary" : "inherit"}>All</Button>
        </ButtonGroup>

        {RevenuePerSecond ?
          <Box id='revenueValue' sx={{ paddingLeft: 1, paddingRight: 1, mt: 3 }}>
            <Typography variant='h6'><b>Revenue:</b> {SecondsOperational ? (RevenuePerSecond * SecondsOperational).toFixed(2) : '0'}€</Typography>
          </Box>
          : null}
      </Box>

    </Screen>
  )
}

export default AssetDetails