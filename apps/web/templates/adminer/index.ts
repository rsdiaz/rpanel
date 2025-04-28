/* eslint-disable @typescript-eslint/no-explicit-any */
import { Output, Services } from '@templates-utils'

export function generate(input: any): Output {
	const services: Services = []

	services.push({
		type: 'app',
		data: {
			serviceName: input.appServiceName,
			source: {
				type: 'image',
				image: input.appServiceImage,
			},
			domains: [
				{
					host: '$(EASYPANEL_DOMAIN)',
					port: 8080,
				},
			],
		},
	})

	return { services }
}
