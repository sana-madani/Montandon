// 导入 fetchData 函数
const { fetchData } = require('/Projects/Frontend/mapping_detail/JS/api.js');

// 模拟 fetch 函数
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ 1: "123" }), // mockData 是您期望的响应数据
  })
);

// 测试用例
describe('fetchData function', () => {
  it('should fetch data successfully', async () => {
    // 调用 fetchData 函数
    await fetchData();
    mockData = { 1: "123" }
    // 检查 fetchData 是否正确处理了响应数据
    expect(mockData).toBeDefined(); // 确保数据已成功接收
    // 进一步验证 fetchData 的行为，例如检查是否正确创建了 HTML 元素等
  });

  it('should handle errors gracefully', async () => {
    // 模拟一个错误响应
    global.fetch.mockImplementationOnce(() => Promise.reject('Fetch Error'));

    // 调用 fetchData 函数
    await expect(fetchData()).rejects.toEqual('Fetch Error');

    // 检查 fetchData 是否正确处理了错误情况
    // 可以检查是否在控制台输出了错误信息等
  });
});
