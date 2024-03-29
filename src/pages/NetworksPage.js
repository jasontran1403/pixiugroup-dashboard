import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import Swal from 'sweetalert2';
import { faker } from '@faker-js/faker';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import { prod, dev } from '../utils/env';
// mock
// ----------------------------------------------------------------------

export default function NetworksPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [currentRoot, setCurrentRoot] = useState(localStorage.getItem('email'));
  const [currentEmail] = useState(localStorage.getItem('email') ? localStorage.getItem('email') : '');
  const [currentAccessToken] = useState(
    localStorage.getItem('access_token') ? localStorage.getItem('access_token') : ''
  );
  const [prevRoot, setPrevRoot] = useState([]);

  const handleProductClick = (email, prev) => {
    setCurrentRoot(email);
    setPrevRoot([...prevRoot, prev]);
  };

  const handleGoBack = () => {
    if (prevRoot.length === 0) {
      return;
    }
    const cur = prevRoot.pop();
    setCurrentRoot(cur);
  };

  const fetchNetwork = (email) => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${prod}/api/v1/secured/getNetwork/${email}`,
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setProduct([...response.data]);
      })
      .catch(() => {
        Swal.fire({
          title: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!',
          icon: 'error',
          timer: 3000,
          position: 'center',
          showConfirmButton: false,
        }).then(() => {
          localStorage.clear();
          navigate('/login', { replace: true });
        });
      });
  };

  useEffect(() => {
    setIsLoading(true);

    fetchNetwork(currentRoot);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentRoot]);

  return (
    <>
      <Helmet>
        <title> Network </title>
        <link rel="icon" type="image/x-icon" href="/assets/logo.svg" />
      </Helmet>

      <Container>
        <ProductList products={product} onProductClick={handleProductClick} />
        <ProductCartWidget onGoBackClick={handleGoBack} />
      </Container>
    </>
  );
}
