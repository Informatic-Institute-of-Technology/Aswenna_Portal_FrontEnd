import type { OfferCardProps } from '../components/investor/OfferCard';
import { comprehensiveProjectsData } from './json';

const [comprehensiveProjectData, comprehensiveVegetableProjectData] = comprehensiveProjectsData as OfferCardProps[];

export const comprehensiveProject: OfferCardProps = comprehensiveProjectData;

export const comprehensiveVegetableProject: OfferCardProps = comprehensiveVegetableProjectData;
