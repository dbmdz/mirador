import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListSubheader from '@mui/material/ListSubheader';
import SingleIcon from '@mui/icons-material/CropOriginalSharp';
import ScrollViewIcon from '@mui/icons-material/ViewColumn';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookViewIcon from './icons/BookViewIcon';
import GalleryViewIcon from './icons/GalleryViewIcon';
import ShiftBookViewIcon from './icons/ShiftBookViewIcon';

const ViewOption = styled(MenuItem, { name: 'WindowViewSettings', slot: 'option' })(({ selected, theme }) => ({
  '& .MuiFormControlLabel-label': {
    borderBottom: '2px solid transparent',
    ...(selected && {
      borderBottomColor: theme.palette.secondary.main,
    }),
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&.Mui-selected.Mui-focusVisible': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    '&:focused': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    color: selected ? theme.palette.secondary.main : undefined,
    display: 'inline-block',
  },
}));

const StyledMenuList = styled(MenuList, { name: 'WindowViewSettings', slot: 'option' })(() => ({
  display: 'inline-flex',
}));

/**
 *
 */
export function WindowViewSettings({
  handleClose = () => {},
  windowViewType,
  viewTypes = [],
  setWindowViewType,
  setShiftBookView = () => {},
  shiftBookView = false,
}) {
  const { t } = useTranslation();
  /** */
  const handleChange = (value) => {
    setWindowViewType(value);
  };

  const iconMap = {
    book: BookViewIcon,
    gallery: GalleryViewIcon,
    scroll: ScrollViewIcon,
    single: SingleIcon,
  };

  /** Suspiciously similar to a component, yet if it is invoked through JSX
      none of the click handlers work? */
  const menuItem = ({ value, Icon }) => (
    <ViewOption
      aria-checked={windowViewType === value}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={windowViewType === value}
      key={value}
      onClick={() => {
        handleChange(value);
        handleClose();
      }}
      role="menuitemradio"
      selected={windowViewType === value}
    >
      <FormControlLabel
        value={value}
        control={<Icon fill="currentcolor" color={windowViewType === value ? 'secondary' : undefined} />}
        label={t(value)}
        labelPlacement="bottom"
      />
    </ViewOption>
  );

  if (viewTypes.length === 0) return null;
  return (
    <>
      <ListSubheader role="presentation" disableSticky>
        {t('view')}
      </ListSubheader>
      <StyledMenuList role="menubar">{viewTypes.map((value) => menuItem({ Icon: iconMap[value], value }))}</StyledMenuList>
      {windowViewType === 'book' && (
        <>
          <ListSubheader role="presentation" disableSticky tabIndex="-1">
            {t('viewOptions')}
          </ListSubheader>
          <ViewOption
            onClick={() => setShiftBookView(!shiftBookView)}
            selected={shiftBookView}
            sx={{
              whiteSpace: 'break-spaces',
            }}
          >
            <FormControlLabel
              control={
                <ShiftBookViewIcon
                  sx={{
                    height: '18px',
                    width: 'auto',
                  }}
                  color={shiftBookView ? 'secondary' : undefined}
                />
              }
              label={t('shiftPages')}
              labelPlacement="bottom"
            />
          </ViewOption>
        </>
      )}
    </>
  );
}

WindowViewSettings.propTypes = {
  handleClose: PropTypes.func,
  setShiftBookView: PropTypes.func,
  setWindowViewType: PropTypes.func.isRequired,
  shiftBookView: PropTypes.bool,
  viewTypes: PropTypes.arrayOf(PropTypes.string),
  windowViewType: PropTypes.string.isRequired,
};
