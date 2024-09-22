export const listConfig = {
    recommend: {
      fields: [
        { name: 'uuid', label: 'UUID', type: 'text', editable: false },
        { name: 'name', label: '名称', type: 'text' },
        { name: 'description', label: '描述', type: 'text' },
        { name: 'size', label: '大小', type: 'text' },
        { name: 'image', label: '图片', type: 'image' },
        { name: 'updatetime', label: '更新时间', type: 'datetime' }
      ]
    },
    hot: {
      fields: [
        { name: 'uuid', label: 'ID', type: 'text', editable: false },
        { name: 'title', label: '标题', type: 'text' },
        { name: 'link', label: '链接', type: 'text' },
        { name: 'image', label: '图片URL', type: 'image' },
        { name: 'description', label: '描述', type: 'text' },
        { name: 'rating', label: '评分', type: 'number' },
        { name: 'category', label: '分类', type: 'text' }
      ]
    },
    latest: {
      fields: [
        { name: 'uuid', label: 'UUID', type: 'text', editable: false },
        { name: 'description', label: '描述', type: 'text' },
        { name: 'image', label: '图片', type: 'image' },
        { name: 'title', label: '标题', type: 'text' },
        { name: 'updateTime', label: '更新时间', type: 'datetime' },
        { name: 'tags', label: '标签', type: 'array' }
      ]
    },
    top: {
      fields: [
        { name: 'uuid', label: 'UUID', type: 'text', editable: false },
        { name: 'title', label: '标题', type: 'text' },
        { name: 'link', label: '链接', type: 'text' },
        { name: 'image', label: '封面', type: 'image' },
        { name: 'introduction', label: '简介', type: 'text' },
        { name: 'score', label: '评分', type: 'number' }
      ]
    },
    carousel: {
      fields: [
        { name: 'uuid', label: 'UUID', type: 'text', editable: false },
        { name: 'image', label: '图片URL', type: 'image' },
        { name: 'altText', label: '替代文本', type: 'text' }
      ]
    }
  };