import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, Typography, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  const footerLinks = [
    {
      title: 'Compañía',
      links: [
        { text: 'Sobre Nosotros', url: '/about' },
        { text: 'Trabaja con Nosotros', url: '/careers' },
        { text: 'Términos y Condiciones', url: '/terms' },
        { text: 'Política de Privacidad', url: '/privacy' },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        { text: 'Preguntas Frecuentes', url: '/faq' },
        { text: 'Envíos', url: '/shipping' },
        { text: 'Devoluciones', url: '/returns' },
        { text: 'Contacto', url: '/contact' },
      ],
    },
    {
      title: 'Mi Cuenta',
      links: [
        { text: 'Mis Pedidos', url: '/orders' },
        { text: 'Mi Perfil', url: '/profile' },
        { text: 'Lista de Deseos', url: '/wishlist' },
        { text: 'Seguimiento de Pedido', url: '/track-order' },
      ],
    },
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '/icons/visa.png' },
    { name: 'Mastercard', icon: '/icons/mastercard.png' },
    { name: 'PayPal', icon: '/icons/paypal.png' },
    { name: 'MercadoPago', icon: '/icons/mercadopago.png' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {/* Logo y descripción */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                textDecoration: 'none',
              }}
            >
              Mi Tienda
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ofrecemos los mejores productos con la mejor calidad y al mejor precio del mercado.
            </Typography>
            
            {/* Redes sociales */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Enlaces del footer */}
          {footerLinks.map((section, index) => (
            <Box key={index}>
              <Typography
                variant="subtitle1"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: '8px' }}>
                    <Link
                      component={RouterLink}
                      to={link.url}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Métodos de pago y copyright */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignItems: 'center', mt: 4 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Aceptamos los siguientes métodos de pago:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {paymentMethods.map((method, index) => (
                <Box
                  key={index}
                  component="img"
                  src={method.icon}
                  alt={method.name}
                  sx={{ height: 24, width: 'auto' }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Mi Tienda. Todos los derechos reservados.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Desarrollado con ❤️ por Tu Empresa
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
