import React, { useEffect, useRef } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "./charting_library";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
}
const TradingViewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbol: "AAPL",
    interval: "D" as ResolutionString,
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: true,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: defaultProps.symbol as string,
        // BEWARE: no trailing slash is expected in feed URL
        // tslint:disable-next-line:no-any
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
          defaultProps.datafeedUrl
        ),
        interval:
          defaultProps.interval as ChartingLibraryWidgetOptions["interval"],
        container: chartContainerRef.current,
        library_path: defaultProps.libraryPath as string,

        locale: "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: defaultProps.chartsStorageApiVersion,
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
      };

      const tvWidget = new widget(widgetOptions);

      console.log({ tvWidget },widgetOptions.datafeed);
      tvWidget.onChartReady(() => {
        console.log('chart readyyyy',);

        tvWidget.headerReady().then(() => {

        console.log('chartheader readyyyy');
            
          const button = tvWidget.createButton();
          button.setAttribute("title", "Click to show a notification popup");
          button.classList.add("apply-common-tooltip");
          button.addEventListener("click", () =>
            tvWidget.showNoticeDialog({
              title: "Notification",
              body: "TradingView Charting Library API works correctly",
              callback: () => {
                console.log("Noticed!");
              },
            })
          );
          button.innerHTML = "Check API";
        });
      });

      return () => {
        tvWidget.remove();
      };
    }
  },[]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default TradingViewChart;
