import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { downloadAttachment, getAssetById } from './AssetController';
import logo from '../assets/images/logo-placeholder2.jpg';

function AssetLogo({ issueId }) {

  const assetQuery = useQuery(
    ['asset' + issueId, issueId],
    () => getAssetById(issueId), { staleTime: 200000, })

  const downloadAttachmentQuery = useQuery(
    ['downloadAttachment' + issueId, assetQuery.isSuccess],
    () => downloadAttachment(assetQuery.data), { staleTime: 200000, retry: false })

  return (
    <div className="asset-img">
      <Box
        style={{
          width: 100,
          height: 100,
          backgroundColor: "#eee",
          backgroundImage: `url(${downloadAttachmentQuery.data ? downloadAttachmentQuery.data : logo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center"
        }}>
      </Box>
    </div>
  )
}

export default AssetLogo