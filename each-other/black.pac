function FindProxyForURL(url, host) {
	// our local URLs from the domains below example.com don't need a proxy:
	if (shExpMatch(host, "*.youku.com") ||
		host.match("sohu") ||
		host.match("youku") ||
		host.match("qiyi") ||
		host.match("baidu") ||
		host.match(".cn") ||
		host.match(".com.cn")/* ||
		host.match("iwebpp.com")*/)
	{
		return "DIRECT;";
	}
 
	// URLs within this network are accessed through
	// port 8080 on fastproxy.example.com:
	//if (isInNet(host, "10.0.0.0", "255.255.248.0"))
	//{
	//	return "PROXY fastproxy.example.com:8080";
	//}
 
	// All other requests go through port 8080 of proxy.example.com.
	// should that fail to respond, go directly to the WWW:
	///return "PROXY localhost:51866;SOCKS localhost:51888;DIRECT";
	
	// ftp site prefer socks5 proxy
	if (url.match("ftp:")) {
		return "DIRECT;SOCKS5 127.0.0.1:51888";
	}
		
	// http site prefer socks5 proxy
	if (url.match("http:")) {
        return "DIRECT;SOCKS5 127.0.0.1:51888;PROXY 127.0.0.1:51866;";
	}
	
	// https site prefer http proxy
	if (url.match("https:")) {
		return "DIRECT;PROXY 127.0.0.1:51866;SOCKS5 127.0.0.1:51888;";
	}
}

