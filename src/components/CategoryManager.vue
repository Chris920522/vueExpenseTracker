<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" v-if="isOpen">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">管理類別</h2>
        <button @click="close" class="text-xl font-bold">&times;</button>
      </div>

      <!-- 類別類型選擇 -->
      <div class="mb-4">
        <select v-model="selectedType" class="w-full p-2 border rounded">
          <option value="收入">收入類別</option>
          <option value="支出">支出類別</option>
        </select>
      </div>

      <!-- 新增類別 -->
      <div class="mb-4">
        <div class="flex gap-2">
          <input v-model="newCategory" 
                 type="text" 
                 class="flex-grow p-2 border rounded"
                 placeholder="請輸入新類別名稱">
          <button @click="addCategory" 
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            新增
          </button>
        </div>
      </div>

      <!-- 類別列表 -->
      <div class="max-h-60 overflow-y-auto">
        <div v-for="category in currentCategories" 
             :key="category"
             class="flex items-center justify-between p-2 hover:bg-gray-100">
          <span>{{ category }}</span>
          <div class="flex gap-2">
            <button @click="startEdit(category)" 
                    class="text-blue-500 hover:text-blue-700">
              編輯
            </button>
            <button @click="deleteCategory(category)" 
                    class="text-red-500 hover:text-red-700">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯類別的彈出視窗 -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 class="text-lg font-bold mb-4">編輯類別名稱</h3>
        <input v-model="editCategoryName" 
               type="text" 
               class="w-full border rounded p-2 mb-4"
               placeholder="請輸入新的類別名稱">
        <div class="flex justify-end gap-2">
          <button @click="saveEdit" 
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            儲存
          </button>
          <button @click="cancelEdit" 
                  class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  incomeCategories: Array,
  expenseCategories: Array
});

const emit = defineEmits(['update:isOpen', 'update:incomeCategories', 'update:expenseCategories']);

const selectedType = ref('收入');
const newCategory = ref('');
const isEditing = ref(false);
const editCategoryName = ref('');
const currentCategory = ref('');

// 預設類別
const defaultIncomeCategories = ['薪水', '獎金'];
const defaultExpenseCategories = ['食', '衣', '住', '行', '育', '樂'];

// 根據選擇的類型顯示對應的類別列表
const currentCategories = computed(() => {
  const defaultCategories = selectedType.value === '收入' ? defaultIncomeCategories : defaultExpenseCategories;
  const customCategories = selectedType.value === '收入' ? props.incomeCategories : props.expenseCategories;
  return [...defaultCategories, ...customCategories];
});
//關閉類別管理
function close() {
  emit('update:isOpen', false);
  newCategory.value = '';
}
//新增類別
function addCategory() {
  if (newCategory.value.trim() === '') {
    alert('請輸入類別名稱');
    return;
  }

  const defaultCategories = selectedType.value === '收入' ? defaultIncomeCategories : defaultExpenseCategories;
  const customCategories = selectedType.value === '收入' ? props.incomeCategories : props.expenseCategories;
  
  if ([...defaultCategories, ...customCategories].includes(newCategory.value)) {
    alert('此類別名稱已存在');
    return;
  }

  if (selectedType.value === '收入') {
    emit('update:incomeCategories', [...props.incomeCategories, newCategory.value]);
  } else {
    emit('update:expenseCategories', [...props.expenseCategories, newCategory.value]);
  }

  newCategory.value = '';
}

function startEdit(category) {
  currentCategory.value = category;
  editCategoryName.value = category;
  isEditing.value = true;
}

function saveEdit() {
  if (editCategoryName.value.trim() === '') {
    alert('請輸入類別名稱');
    return;
  }

  const defaultCategories = selectedType.value === '收入' ? defaultIncomeCategories : defaultExpenseCategories;
  const customCategories = selectedType.value === '收入' ? props.incomeCategories : props.expenseCategories;
  
  if ([...defaultCategories, ...customCategories].includes(editCategoryName.value) && 
      editCategoryName.value !== currentCategory.value) {
    alert('此類別名稱已存在');
    return;
  }

  // 如果是預設類別，則添加到自訂類別中
  if (defaultCategories.includes(currentCategory.value)) {
    if (selectedType.value === '收入') {
      emit('update:incomeCategories', [...props.incomeCategories, editCategoryName.value]);
    } else {
      emit('update:expenseCategories', [...props.expenseCategories, editCategoryName.value]);
    }
  } else {
    // 如果是自訂類別，則更新它
    if (selectedType.value === '收入') {
      const newCategories = props.incomeCategories.map(cat => 
        cat === currentCategory.value ? editCategoryName.value : cat
      );
      emit('update:incomeCategories', newCategories);
    } else {
      const newCategories = props.expenseCategories.map(cat => 
        cat === currentCategory.value ? editCategoryName.value : cat
      );
      emit('update:expenseCategories', newCategories);
    }
  }

  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editCategoryName.value = '';
  currentCategory.value = '';
}
//刪除類別
function deleteCategory(category) {
  const defaultCategories = selectedType.value === '收入' ? defaultIncomeCategories : defaultExpenseCategories;
  
  if (confirm(`確定要刪除 ${category} 類別嗎？`)) {
    if (selectedType.value === '收入') {
      // 如果是預設類別，從預設列表中移除
      if (defaultCategories.includes(category)) {
        const index = defaultIncomeCategories.indexOf(category);
        if (index > -1) {
          defaultIncomeCategories.splice(index, 1);
        }
      } else {
        // 如果是自訂類別，從自訂列表中移除
        emit('update:incomeCategories', props.incomeCategories.filter(cat => cat !== category));
      }
    } else {
      // 如果是預設類別，從預設列表中移除
      if (defaultCategories.includes(category)) {
        const index = defaultExpenseCategories.indexOf(category);
        if (index > -1) {
          defaultExpenseCategories.splice(index, 1);
        }
      } else {
        // 如果是自訂類別，從自訂列表中移除
        emit('update:expenseCategories', props.expenseCategories.filter(cat => cat !== category));
      }
    }
  }
}
</script> 