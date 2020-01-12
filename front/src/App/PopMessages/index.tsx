import IconButton from '@material-ui/core/IconButton';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Success from '@material-ui/icons/CheckCircle';
import Close from '@material-ui/icons/Close';
import Error from '@material-ui/icons/Error';
import Info from '@material-ui/icons/Info';
import Warning from '@material-ui/icons/Warning';
import { SnackbarProvider } from 'notistack';
import React, { ComponentType } from 'react';

const STYLE_ICONS: React.CSSProperties = {
  opacity: 0.9,
  fontSize: 20,
};

const STYLE_VARIANT_ICONS: React.CSSProperties = {
  ...STYLE_ICONS,
  marginRight: 10,
};

interface IProps {
  children: React.ReactNode;
}

const VariantIcon = ({ Icon }: { Icon: ComponentType<SvgIconProps> }) => {
  return <Icon style={STYLE_VARIANT_ICONS} />;
};

const PopMessages = ({ children }: IProps) => {
  return (
    <SnackbarProvider
      iconVariant={{
        error: <VariantIcon Icon={Error} />,
        success: <VariantIcon Icon={Success} />,
        info: <VariantIcon Icon={Info} />,
        warning: <VariantIcon Icon={Warning} />,
      }}
      autoHideDuration={1500}
      action={
        <IconButton color="inherit">
          <Close style={STYLE_ICONS} />
        </IconButton>
      }
    >
      {children}
    </SnackbarProvider>
  );
};

export default PopMessages;
