import Screen from '../components/Screen'
import styled from '@emotion/styled';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { ReactComponent as BackIcon } from '../assets/images/back.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssetById, getAssetRequestsByAssetId } from '../components/AssetController';
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

  const assetQuery = useQuery(['asset', id], () => getAssetById(id), { staleTime: 5000, })
  const assetRequestsQuery = useQuery(['assetRequestsByAssetId', id], () => getAssetRequestsByAssetId(id), { staleTime: 5000, })

  useEffect(() => {
    if (assetRequestsQuery.isSuccess) {

      const currentTime = new Date().getTime();
      let isOperational;
      let currentTenant;

      if (assetRequestsQuery.data.issues.length) {
        assetRequestsQuery.data.issues.forEach(ar => {
          const startDate = ar.fields[AssetRequestsCustomField.StartDate];
          const endDate = ar.fields[AssetRequestsCustomField.EndDate];

          if (startDate && endDate) {
            if (new Date(startDate).getTime() < currentTime && currentTime < new Date(endDate).getTime()) {
              isOperational = true;
              currentTenant = ar.fields[AssetRequestsCustomField.TenantName];
            }
          }
        });
      }
      setIsOperational(isOperational);
      setCurrentTenant(currentTenant);
    }
  }, [assetRequestsQuery.isSuccess, assetRequestsQuery.data]);

  return (
    <Screen id='AssetDetails'>
      <HeaderWithBackButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          Asset Details
        </Typography>

        <Button
          className='back-btn'
          variant='text'
          onClick={() => navigate("/assets")}>
          <BackIcon color="#444" style={{ width: 25, height: 25 }} />
        </Button>

      </HeaderWithBackButton>


      {assetQuery.isSuccess ?
        <Box className="asset-details flex-col" sx={{ p: 1, alignItems: 'center' }}>
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

          <Typography variant='subtitle1'><b>Tenant Name:</b> {CurrentTenant ? CurrentTenant : '-'}</Typography>
          <Typography variant='subtitle1'><b>Real Time income:</b> {CurrentTenant ? CurrentTenant : '-'}</Typography>

        </Box>
        : null}

    </Screen>
  )
}

export default AssetDetails