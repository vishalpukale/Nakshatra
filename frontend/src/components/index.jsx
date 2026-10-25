/**
 * --------------------------------------------------------
 * File        : index.js
 * Description : Exports components for easy import in other parts of the application.
 * 
 * Notes:
 * - Exports a variety of loader components like `FullScreenLoader`, `CircularLoader`, and `DotLoader`.
 * - Includes utility components like `Header`, `DialogBox`, and `Acknowledge`.
 * - `ContentLoader` is commented out, possibly not in use.
 * --------------------------------------------------------
 */



import FullScreenLoader from "./loader/FullScreen";
import Header from "./header";
import CircularLoader from "./loader/Circular";
import DialogTitle from "./dialog-title";
import DialogBox from "./dialog-box";
import DialogTitleSuccess from "./dialog-title-success";
// import ContentLoader from "./content-loader";
import DotLoader from "./loader/DotLoader";
import NoInternet from "./no-internet";
import WorkFlowLoader from "./loader/WorkFlowLoader";
import Acknowledge from "./acknowledge";
import DashboardHeader from "./header/DashboardHeader";
import DataTable from './table/index'
import BackButtonHeader from "./header/instructionHeader"
import AnnouncementSkeletonLoader from "./loader/AnnouncementSkeletonLoader";
import TopEarnersSkeletonLoader from "./loader/TopEarnersSkeletonLoader";

export {
  FullScreenLoader,
  CircularLoader,
  Header,
  DialogTitle,
  DialogBox,
  DialogTitleSuccess,
  DotLoader,
  // ContentLoader,
  NoInternet,
  WorkFlowLoader,
  Acknowledge,
  DashboardHeader,
  DataTable,BackButtonHeader,AnnouncementSkeletonLoader,TopEarnersSkeletonLoader
};
