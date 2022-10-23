import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Screen from '../components/Screen'
import { useQuery } from "@tanstack/react-query";
import { listAssets } from '../components/AssetController';
import { AssetsCustomField } from '../helpers/constants';
import logo from '../assets/images/logo-placeholder2.jpg';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import FilterModal from '../components/FilterModal';
import { Link } from 'react-router-dom';

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
    staleTime: 30000,
  });

  const [InitialAssets, setInitialAssets] = useState<any[]>([]);
  const [Assets, setAssets] = useState<any[]>([]);
  const [Locations, setLocations] = useState<any[]>([]);
  const [Types, setTypes] = useState<any[]>([]);
  const [OperationalStatuses, setOperationalStatuses] = useState<any[]>([]);
  const [ShowFilters, setShowFilters] = useState<boolean>(false);
  const [Filters, setFilters] = useState<any>(null);

  useEffect(() => {
    if (assetsQuery.isSuccess) {
      let assets: any[] = [];
      let locations: string[] = [];
      let types: string[] = [];
      let operationalStatuses: string[] = [];

      if (assetsQuery.data.issues?.length) {
        assetsQuery.data.issues.forEach(issue => {
          const name = issue.fields[AssetsCustomField.Name];
          const location = issue.fields[AssetsCustomField.Location];
          const type = issue.fields[AssetsCustomField.Type].value;
          const operationalStatus = issue.fields[AssetsCustomField.OperationalStatus].value;
          const id = issue.id;

          assets.push({ name, logo: "", location, id, type, operationalStatus });

          if (!locations.includes(location)) { locations.push(location); }
          if (!types.includes(type)) { types.push(type); }
          if (!operationalStatuses.includes(operationalStatus)) { operationalStatuses.push(operationalStatus); }
        });
      }

      setInitialAssets(assets);
      setAssets(assets);
      setLocations(locations);
      setTypes(types);
      setOperationalStatuses(operationalStatuses);
    }
    // eslint-disable-next-line
  }, [assetsQuery.isSuccess]);

  useEffect(() => {
    if (Filters && InitialAssets.length) {
      let initialAssets = [...InitialAssets];

      if (Filters.LocationSelected !== "0") {
        initialAssets = initialAssets.filter(ass => ass.location === Filters.LocationSelected);
      }

      if (Filters.TypeSelected !== "0") {
        initialAssets = initialAssets.filter(ass => ass.type === Filters.TypeSelected);
      }

      if (Filters.OperationalStatusSelected !== "0") {
        initialAssets = initialAssets.filter(ass => ass.operationalStatus === Filters.OperationalStatusSelected);
      }

      setAssets(initialAssets);
    }
  }, [Filters, InitialAssets]);

  return (
    <Screen id='Assets'>
      <Header title="Asset list" showFilters={() => setShowFilters(true)} />

      {assetsQuery.isLoading ? <Typography variant='subtitle1' sx={{ m: 2 }}>Getting assets...</Typography>
        : assetsQuery.isError ? <Typography variant='subtitle1' sx={{ m: 2 }}>Error getting assets.</Typography> :
          <>

            {Assets.length ?
              <div id="assetList">
                {Assets.map(asset => {
                  return (
                    <Link key={asset.id} to={`/asset/${asset.id}`}>
                      <AssetItem className="assetitem flex jcsb">
                        <div className="asset-img">
                          <img src={asset.logo ? asset.logo : logo} style={{ width: 80 }} alt="logo" />
                        </div>
                        <div className="asset-text flex-col">
                          <Typography className='no-dec' variant='subtitle1' sx={{ fontWeight: 700, color: "#222" }}>{asset.name}</Typography>
                          <Typography className='no-dec' variant='subtitle1' sx={{ fontWeight: 700, color: "#222" }}>{asset.location}</Typography>
                        </div>
                      </AssetItem>
                    </Link>
                  )
                })}
              </div>
              : <Typography variant='subtitle1' sx={{ fontWeight: 700, m: 2 }}>No assets found based on the selected criteria</Typography>}

            {Locations.length && Types.length && OperationalStatuses.length ?
              <FilterModal
                initialAssets={InitialAssets}
                locations={Locations}
                types={Types}
                operationalStatuses={OperationalStatuses}
                show={ShowFilters}
                close={() => setShowFilters(false)}
                setFilters={filters => setFilters(filters)}
              />
              : null}

          </>}

    </Screen>
  )
}

export default Assets