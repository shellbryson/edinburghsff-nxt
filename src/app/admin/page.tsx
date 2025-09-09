import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function AdminPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the admin interface. Add management features here.
      </Typography>
    </Container>
  );
}
