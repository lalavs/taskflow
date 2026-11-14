import { ImageResponse } from 'next/og';

import Icon, { contentType, size } from '@/app/icon';

jest.mock('next/og', () => ({ ImageResponse: jest.fn() }));

const mockImageResponse = jest.mocked(ImageResponse);

describe('Icon', () => {
  it('renders the app icon as a png of the declared size', () => {
    const image = { kind: 'image' };
    mockImageResponse.mockReturnValue(image as unknown as ImageResponse);

    const result = Icon();

    expect(result).toEqual(image);
    expect(size).toEqual({ width: 32, height: 32 });
    expect(contentType).toBe('image/png');
    expect(mockImageResponse).toHaveBeenCalledTimes(1);
    expect(mockImageResponse).toHaveBeenCalledWith(expect.anything(), { width: 32, height: 32 });
  });
});
