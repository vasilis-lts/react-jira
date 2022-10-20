import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Screen from '../components/Screen'
import { useQuery } from "@tanstack/react-query";
import { listAssets } from '../components/AssetController';
import { CustomField } from '../helpers/constants';
import logo from '../assets/images/logo-placeholder2.jpg';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import FilterModal from '../components/FilterModal';

const AssetItem = styled('div')(({ theme }) => ({
  padding: 10,
  borderBottom: "1px solid #222",
  backgroundColor: "aliceblue",

  '& .asset-text': {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-evenly',
  }

}));

function Assets() {
  // const queryClient = useQueryClient();
  const assetsQuery = useQuery(['listAssets'], listAssets, {
    staleTime: 200000,
  });

  const [InitialAssets, setInitialAssets] = useState<any[]>([]);
  const [Assets, setAssets] = useState<any[]>([]);
  const [Locations, setLocations] = useState<any[]>([]);
  const [Types, setTypes] = useState<any[]>([]);
  const [OperationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [ShowFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    if (assetsQuery.isSuccess) {
      let assets: any[] = [];
      let locations: string[] = [];
      let types: string[] = [];
      let operationalStatuses: string[] = [];

      if (assetsQuery.data.issues?.length) {
        assetsQuery.data.issues.forEach(issue => {
          const name = issue.fields[CustomField.Name];
          const location = issue.fields[CustomField.Location];
          const type = issue.fields[CustomField.Type].value;
          const operationalStatus = issue.fields[CustomField.OperationalStatus].value;

          assets.push({ name, logo: "", location })
          locations.push(location);
          types.push(type);
          operationalStatuses.push(operationalStatus);
        });
      }

      setInitialAssets(assets);
      setAssets(assets);
      setLocations(locations);
      setTypes(types);
      setOperationalStatuses(operationalStatuses);
    }
  }, [assetsQuery.isSuccess, assetsQuery.data.issues]);

  return (
    <Screen id='Login'>
      <Header title="Asset list" showFilters={() => setShowFilters(true)} />

      {Assets.length ?
        <div id="assetList">
          {Assets.map(asset => {
            return (
              <AssetItem className="assetitem flex jcsb">
                <div className="asset-img">
                  <img src={asset.logo ? asset.logo : logo} style={{ width: 80 }} alt="logo" />
                </div>
                <div className="asset-text flex-col">
                  <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>{asset.name}</Typography>
                  <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>{asset.location}</Typography>
                </div>
              </AssetItem>)
          })}
        </div>
        : null}

      {Locations.length && Types.length && OperationalStatuses.length ?
        <FilterModal
          initialAssets={InitialAssets}
          locations={Locations}
          types={Types}
          operationalStatuses={OperationalStatuses}
          show={ShowFilters}
          close={() => setShowFilters(false)}
        />
        : null}

    </Screen>
  )
}

export default Assets