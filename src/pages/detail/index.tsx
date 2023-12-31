import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./detail.module.css";
import Loading from "../../components/loading";

interface CoinProp {
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  low_24h: string;
  high_24h: string;
  total_volume_24h: string;
  delta_24h: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedLowprice: string;
  formatedHighprice: string;
  numberDelta: number;
  error?: string;
}

export function Detail() {
  const { cripto } = useParams();
  const [detail, setDetail] = useState<CoinProp>();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function getData() {
    if (!cripto) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `https://sujeitoprogramador.com/api-cripto/coin/?key=9b74f336bee213f4&pref=BRL&symbol=${cripto}`
      );

      if (!response.ok) {
        navigate("*");
        return;
      }

      const data = await response.json();

      const price = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const resultData = {
        ...data,
        formatedPrice: price.format(Number(data.price)),
        formatedMarket: price.format(Number(data.market_cap)),
        formatedLowprice: price.format(Number(data.low_24h)),
        formatedHighprice: price.format(Number(data.high_24h)),
        numberDelta: parseFloat(data.delta_24h.replace(",", ".")),
      };

      const loadingTimeout = setTimeout(() => {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }, 1000);

      setDetail(resultData);
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
    }
  }

  useEffect(() => {
    getData();
  }, [cripto, navigate]);

  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className={styles.center}>{detail?.name}</h1>
          <p className={styles.center}>{detail?.symbol}</p>

          <section className={styles.content}>
            <p>
              <strong>Preço:</strong> {detail?.formatedPrice}
            </p>
            <p>
              <strong>Lucro/Perda:</strong>
              <span
                className={
                  detail?.numberDelta && detail?.numberDelta >= 0
                    ? styles.profit
                    : styles.loss
                }
              >
                {detail?.delta_24h}
              </span>
            </p>
            <p>
              <strong>Maior preço 24h:</strong> {detail?.formatedHighprice}
            </p>
            <p>
              <strong>Menor preço 24h:</strong> {detail?.formatedLowprice}
            </p>
            <p>
              <strong>Valor Global De Mercado:</strong> {detail?.formatedMarket}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
