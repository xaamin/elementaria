import type {
  FunctionComponent,
  ElementType,
  JSXElementConstructor,
  ReactElement,
  RefAttributes,
} from 'react';
import type { Svg } from 'react-native-svg';

import {
  Icon as TheIcon,
  UIIcon as TheUIIcon,
  createIcon as theCreateIcon,
} from '@/components/z/icon';

import { withFrozenProps } from '../primitive';

export type IconProps = {
  height?: string | number;
  width?: string | number;
  fill?: string;
  color?: string;
  size?: string | number;
  stroke?: string;
  as?: ElementType;
  className?: string;
  classNameColor?: string;
  style?: any;
} & RefAttributes<Svg>;

export type UIIconProps = IconProps;

export type CreateIconOptions = {
  defaultProps?: any;
  type?: any;
  path?:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ReactElement<unknown, string | JSXElementConstructor<any>>[];
  viewBox?: string;
  d?: string;
  displayName?: string;
};

const Icon = withFrozenProps<IconProps, 'size'>(TheIcon);

const UIIcon = withFrozenProps<UIIconProps, 'size'>(TheUIIcon);

const createIcon = (
  options: CreateIconOptions,
): FunctionComponent<UIIconProps> =>
  withFrozenProps<UIIconProps, 'size'>(theCreateIcon(options));

export { createIcon, Icon, UIIcon };

export {
  AddIcon,
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  AtSignIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CircleIcon,
  ClockIcon,
  CloseCircleIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FavouriteIcon,
  GlobeIcon,
  GripVerticalIcon,
  HelpCircleIcon,
  InfoIcon,
  LinkIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  MessageCircleIcon,
  MoonIcon,
  PaperclipIcon,
  PhoneIcon,
  PlayIcon,
  RemoveIcon,
  Repeat1Icon,
  RepeatIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  SlashIcon,
  StarIcon,
  SunIcon,
  ThreeDotsIcon,
  TrashIcon,
  UnlockIcon,
} from '@/components/z/icon';
