<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:output method="html" indent="yes"/>


	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				<link rel="stylesheet" href="https://bulma.io/css/bulma-docs.min.css?v=201903212019"/>
				<title>DDD</title>
			</head>
			<body>
				<div class="container">
					<table class="table is-bordered">
						<thead>
							<tr>
								<th>
									<abbr title="Компонент">Компонент</abbr>
								</th>
								<th>
									<abbr title="Описание">Описание</abbr>
								</th>
							</tr>
						</thead>
						<tbody>
							<xsl:apply-templates select="//ddd/components/component"/>
						</tbody>
					</table>
				</div>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="//ddd/components/component" name="header">
		<tr>
			<td>
				<xsl:value-of select="string(@name)"/>
			</td>
			<td>
				<pre>
					<xsl:value-of select="text()"/>
				</pre>
			</td>
		</tr>
	</xsl:template>

</xsl:stylesheet>