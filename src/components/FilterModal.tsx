import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { MenuItem, Select } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 0,
};

export default function FilterModal(props) {
  const [LocationSelected, setLocationSelected] = React.useState<string>('0');
  const [TypeSelected, setTypeSelected] = React.useState<string>('0');
  const [OperationalStatusSelected, setOperationalStatusSelected] = React.useState<string>('0');

  return (
    <div>
      <Modal
        open={props.show}
        onClose={() => props.close()}
        aria-labelledby="modalTitle"
      >
        <Box sx={modalStyle}>
          <Box sx={{ textAlign: "center", borderBottom: '1px solid #222', width: '100%', padding: 2 }}>
            <Typography
              id="modalTitle"
              variant="h6"
              component="h2"
            >Filters</Typography>
          </Box>

          {props.initialAssets.length ?
            <Box sx={{ width: '100%', padding: 2 }}>

              <Box className="flex-col">
                <label htmlFor="locationsFilter">Location</label>
                <Select
                  id='locationsFilter'
                  value={LocationSelected}
                  onChange={e => setLocationSelected(e.target.value)}
                >
                  <MenuItem key={'location0'} value={"0"}>Select location</MenuItem>
                  {props.locations.map(location => {
                    return <MenuItem key={location} value={location}>{location}</MenuItem>
                  })}
                </Select>
              </Box>

              <Box className="flex-col" sx={{ mt: 1 }}>
                <label htmlFor="typesFilter">Type</label>
                <Select
                  id='typesFilter'
                  value={TypeSelected}
                  onChange={e => setTypeSelected(e.target.value)}
                >
                  <MenuItem key={'type0'} value={"0"}>Select type</MenuItem>
                  {props.types.map(type => {
                    return <MenuItem key={type} value={type}>{type}</MenuItem>
                  })}
                </Select>
              </Box>

              <Box className="flex-col" sx={{ mt: 1 }}>
                <label htmlFor="operationalStatusesFilter">Operational statuses</label>
                <Select
                  id='operationalStatusesFilter'
                  value={OperationalStatusSelected}
                  onChange={e => setOperationalStatusSelected(e.target.value)}
                >
                  <MenuItem key={'operationalstatuse0'} value={"0"}>Select operational status</MenuItem>
                  {props.operationalStatuses.map(operationalstatus => {
                    return <MenuItem key={operationalstatus} value={operationalstatus}>{operationalstatus}</MenuItem>
                  })}
                </Select>
              </Box>

            </Box> :
            <Box sx={{ width: '100%', padding: 2 }}>No assets available to filter</Box>}

          <Box sx={{ width: '100%', padding: 2, mt: 0 }} className="flex-col">

            <Button
              variant='contained'
              color='info'
              onClick={() => {
                props.setFilters({ LocationSelected, TypeSelected, OperationalStatusSelected })
                props.close();
              }}
              size='large'
            >Select</Button>
            <Button
              sx={{ mt: 1 }}
              variant='contained'
              color='inherit'
              onClick={() => {
                setLocationSelected("0");
                setTypeSelected("0");
                setOperationalStatusSelected("0");
              }}
              size='large'
            >Clear filters</Button>
            <Button
              sx={{ mt: 1 }}
              variant='contained'
              color='inherit'
              onClick={() => {
                props.close();
              }}
              size='large'
            >Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
