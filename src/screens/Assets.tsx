import React, { useEffect } from 'react'
import Header from '../components/Header'
import Screen from '../components/Screen'
// import { useQuery, useQueryClient } from "@tanstack/react-query";

function Assets() {
  // const queryClient = useQueryClient();
  // const assetsQuery = useQuery(['getProject'], getProject, {
  //   staleTime: 2000,
  // });

  // useEffect(() => {
  //   if (assetsQuery.isSuccess) {
  //     console.log(assetsQuery.data);
  //   }
  // }, [assetsQuery.isSuccess]);

  useEffect(() => {
    // getProject();
  }, []);

  return (
    <Screen id='Login'>
      <Header title="Asset list" />
    </Screen>
  )
}

export default Assets