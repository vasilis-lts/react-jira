import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
};

const buttonStyle = {
  margin: '15px 10px',
  fontSize: 18
}

export default function FilterModal(props) {

  return (
    <div>
      <Modal
        open={props.show}
        onClose={() => props.close()}
        aria-labelledby="modalTitle"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modalTitle"
            variant="h6"
            component="h2"
            style={{ textAlign: "center", borderBottom: '1px solid #222' }}
          >Filters</Typography>

        </Box>
      </Modal>
    </div>
  );
}
