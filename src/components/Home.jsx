import React from "react";
import { Typography, Row, Col, Statistic } from "antd";
import { Link } from "react-router-dom";
import { useGetCryptosQuery } from "../services/cryptoApi";
import Cryptocurrencies from "../components/Cryptocurrencies";
import Loader from "../components/Loader";

const { Title } = Typography;

const Home = () => {
  const { data, isFetching, error } = useGetCryptosQuery();

  if (isFetching) return <Loader />;

  if (error) {
    console.error('Error fetching data:', error);
    if (error.status === 429) {
      return (
        <div>
          Error: Quota exhausted. Please visit{" "}
          <a
            href="https://www.binance.com/en/support/faq"
            target="_blank"
            rel="noopener noreferrer"
          >
            Binance API FAQ
          </a>{" "}
          to learn more about rate limits.
        </div>
      );
    }
    if (error.status === 404) {
      return <div>Error: Resource not found (404)</div>;
    }
    return <div>Error: Unable to fetch global stats</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>Error: Unable to fetch global stats</div>;
  }

  // Extracting data from Binance API response
  const totalCryptocurrencies = data.length;
  const totalMarketCap = data.reduce((acc, crypto) => acc + (parseFloat(crypto.quoteVolume) || 0), 0);
  const total24hVolume = data.reduce((acc, crypto) => acc + (parseFloat(crypto.volume) || 0), 0);
  const totalMarkets = new Set(data.map(crypto => crypto.symbol)).size;

  return (
    <>
      <Title level={2} className="heading">Global Crypto Stats</Title>
      <Row>
        <Col span={12}><Statistic title="Total Cryptocurrencies" value={totalCryptocurrencies} /></Col>
        <Col span={12}><Statistic title="Total Market Cap" value={`$${totalMarketCap.toFixed(2)}`} /></Col>
        <Col span={12}><Statistic title="Total 24h Volume" value={`$${total24hVolume.toFixed(2)}`} /></Col>
        <Col span={12}><Statistic title="Total Markets" value={totalMarkets} /></Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Top 10 Cryptocurrencies in the world</Title>
        <Title level={3} className="show-more"><Link to="/cryptocurrencies">Show More</Link></Title>
      </div>
      <Cryptocurrencies simplified />
    </>
  );
};

export default Home;
