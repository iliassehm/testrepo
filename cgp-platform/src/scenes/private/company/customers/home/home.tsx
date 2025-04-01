import BlurFeature from "../../../../../components/BlurFeature";
import { Widget } from "../../../../../components/Widget";
import InvestorProfile from "./InvestorProfile/investorProfile";
import Notes from "./Note/note";
import WidgetProjectItem from "./Project/widgetProjectItem";
import WidgetRegulation from "./Regulation/widgetRegulation";
import Tasks from "./Task/task";
import WealthObjectives from "./Wealth/wealthObjectives";
import WidgetWealth from "./Wealth/widgetWealth";

export const CompanyCustomersHome = () => {
  return (
    <div className="w-full">
      <div className="md:flex gap-4 mb-4">
        <Widget className="md:w-[65%]" containerClassName="grow">
          <WidgetWealth />
        </Widget>

        <Widget className="mt-4 md:mt-0 md:w-[35%]" containerClassName="grow">
          <BlurFeature feature="conformity" />
          <WidgetRegulation />
        </Widget>
      </div>

      <div className="grid grid-cols-2 xl:flex gap-4 mb-4 xl:items-stretch">
        <Widget
          className="col-span-2 xl:w-[50%] min-h-[300px]"
          containerClassName="grow"
        >
          <BlurFeature feature="project" />
          <WidgetProjectItem />
        </Widget>

        <Widget
          className="xl:w-[25%]"
          containerClassName="relative h-full xl:flex xl:items-stretch"
        >
          <BlurFeature feature="notes" />
          <Notes />
        </Widget>
        <Widget
          className="xl:w-[25%]"
          containerClassName="relative h-full xl:flex xl:items-stretch"
        >
          <BlurFeature feature="tasks" />
          <Tasks mode="read" />
        </Widget>
      </div>
      <div className="md:flex gap-4 mb-4">
        <Widget className="md:w-[65%]" containerClassName="grow">
          <BlurFeature feature="conformity" />
          <InvestorProfile />
        </Widget>
        <Widget className="mt-4 md:mt-0 md:w-[35%]" containerClassName="grow">
          <BlurFeature feature="conformity" />
          <WealthObjectives />
        </Widget>
      </div>
    </div>
  );
};
