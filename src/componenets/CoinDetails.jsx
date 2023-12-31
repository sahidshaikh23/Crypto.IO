import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import { useParams } from "react-router-dom";
import ErrorComponenet from "./ErrorComponenet";
import { useColorModeValue } from "@chakra-ui/react";
import Chart from "./Chart";
import { wrap } from "framer-motion";

const CoinDetails = () => {
  const params = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");
  const [chartData, setChartData] = useState([]);

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "usd" ? "$" : "€";

  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1Y", "max"]; 
  
  const switchChartStats = (key) => {

    switch (key) {
      case  "24h": 
      setDays("24h");
      setLoading(true);  
        break;
    

        case  "7d": 
      setDays("7d");
      setLoading(true);  
        break;

        case  "14d": 
      setDays("14d");
      setLoading(true);  
        break;

        case  "30d": 
      setDays("30d");
      setLoading(true);  
        break;

        case  "60d": 
      setDays("60d");
      setLoading(true);  
        break;

        case  "200d": 
      setDays("200d");
      setLoading(true);  
        break;

        case  "1Y": 
      setDays("365d");
      setLoading(true);  
        break;

        case  "max": 
      setDays("max");
      setLoading(true);  
        break;
      default:
        setDays("24h");
        setLoading(true); 
        break;
    }
  }

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);

        const { data: coinData } = await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setCoin(data);
        setChartData( coinData.prices);

        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [params.id,currency,days]);

  if (error) return <ErrorComponenet message={"Error While Fetching Coin"} />;

  return (
    <Container maxW={"container.lg"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box w={"full"} borderWidth={1}>

            <Chart arr={chartData} currency={currencySymbol} days={days}/>
          </Box>
          <HStack p={4} mt={5} spacing={"5"} overflowX={"auto"} >
            {
              btns.map((i)=>(
                <Button p={4}  key={i} onClick={()=>switchChartStats(i)}>
                    {i}
                </Button>
              ))
            }
          </HStack>

          <RadioGroup value={currency} onChange={setCurrency} p={8}>
            <HStack spacing={4}>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={4} p={16} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={"0.7"}>
              Last Updated On {Date(coin.market_data.last_update).split("G")[0]}{" "}
            </Text>
            <Image src={coin.image.large} w={16} h={16} objectFit={"contain"} />
            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>
              <StatHelpText>
                <Stack direction={"row"} spacing={4}>
                  <StatArrow
                    type={
                      coin.market_data.price_change_percentage_24h > 0
                        ? "increase"
                        : "decrease"
                    }
                  />
                  <Text> {coin.market_data.price_change_percentage_24h}%</Text>
                </Stack>
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={"2xl"}
              bgColor={useColorModeValue("whitesmoke", "whatsapp")}
              color={useColorModeValue("blackAlpha.900", "whatsapp")}
            >{`#${coin.market_cap_rank}`}</Badge>

            <CustomBar high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
            low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}
            />

            <Box w={"full"} p={"4"}>
                    <Item title={"Max Supply"} value={coin.market_data.max_supply}></Item>
                    <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply}></Item>
                    <Item title={"Market Capital"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}></Item>
                    <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`}></Item>
                    <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`}></Item>



                 




            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item= ({title, value})=>(
  <HStack w={"full"} justifyContent={"space-between"} my={4}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{value}</Text>
    
  </HStack>
);

const CustomBar = ({ high, low }) => (

  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"}/>
    <HStack w={"full"} justifyContent={"space-between"}> 
    <Badge children={low} colorScheme={"red"}></Badge>
    <Text fontSize={"sm"}>24H Range</Text>
    <Badge children={high} colorScheme={"green"}></Badge>

    </HStack>
  </VStack>

);


  



export default CoinDetails;
