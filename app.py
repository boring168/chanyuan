import streamlit as st
import json
from datetime import datetime
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import urlopen

st.set_page_config(page_title="BTC Dashboard", page_icon=":chart_with_upwards_trend:")

st.title("BTC 数据展示")


@st.cache_data(ttl=60)
def fetch_btc_data():
    base_url = "https://api.coingecko.com/api/v3/simple/price"
    params = urlencode({
        "ids": "bitcoin",
        "vs_currencies": "usd",
        "include_24hr_vol": "true",
    })
    url = f"{base_url}?{params}"

    with urlopen(url, timeout=10) as response:
        if response.status != 200:
            raise URLError(f"HTTP {response.status}")
        data = json.loads(response.read().decode("utf-8"))

    btc = data.get("bitcoin", {})
    return btc.get("usd"), btc.get("usd_24h_vol")


if st.button("刷新数据"):
    fetch_btc_data.clear()
    st.rerun()


try:
    price_usd, vol_24h = fetch_btc_data()
    if price_usd is None or vol_24h is None:
        st.error("暂时无法获取 BTC 数据，请稍后重试。")
    else:
        st.metric(label="BTC 当前价格 (USD)", value=f"${price_usd:,.2f}")
        st.metric(label="BTC 24h 成交量 (USD)", value=f"${vol_24h:,.2f}")
        st.caption(f"最后更新时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
except URLError:
    st.error("数据请求失败，请稍后重试。")
except Exception:
    st.error("暂时无法显示数据，请稍后重试。")

st.caption("数据来源：CoinGecko")
