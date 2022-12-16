import { useQuery } from '@tanstack/react-query';
import { Box, Skeleton, Typography } from '@mui/material';
import { downloadAttachment, getAssetById } from './AssetController';

const AssetLogo = ({ issueId }) => {

  const assetQuery = useQuery(
    ['asset' + issueId, issueId],
    () => getAssetById(issueId), { staleTime: 200000, })

  const downloadAttachmentQuery = useQuery(
    ['downloadAttachment' + issueId],
    () => downloadAttachment(assetQuery.data),
    { staleTime: 200000, retry: false, enabled: assetQuery.isSuccess })

  return (
    <div className="asset-img">
      {
        !downloadAttachmentQuery.data ?
          <Skeleton variant="rectangular" width={100} height={100} /> :
          downloadAttachmentQuery.data === 'null' ?
            <Box
              style={{
                width: 100,
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f2f2f2",
              }}>
              <Typography sx={{ color: "#777" }} variant="subtitle2">No image</Typography>
            </Box>
            :
            <Box
              style={{
                width: 100,
                height: 100,
                backgroundColor: "#f2f2f2",
                backgroundImage: `url(${downloadAttachmentQuery.data})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center"
              }}>
            </Box>}

    </div>
  )
};
export default AssetLogo;